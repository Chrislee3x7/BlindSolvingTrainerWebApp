import { useState, useEffect, useRef, useMemo, JSX, useCallback } from "react";
import { TrainingSettings } from "./TrainingScreen";
import { PieceViews } from "./PieceViews";
import { MemoSchemeType } from "./MemoScheme";
import { CornerPiece, Cube, EdgePiece, Sticker } from "./Cube";

type useTrainerProps = {
  settings: TrainingSettings,
  memoScheme: MemoSchemeType,
}

export const useTrainer = ({ settings, memoScheme }: useTrainerProps) => {
  const { mode, timeTrialDuration, pieceCount, pieceTypes } = settings
  const cube = useMemo<Cube>(() => new Cube(memoScheme), [memoScheme]);

  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [sessionOver, setSessionOver] = useState<boolean>(false);
  const [sessionPaused, setSessionPaused] = useState<boolean>(false)


  const [clock, setClock] = useState<number>(-1);

  const [currPiece, setCurrPiece] = useState<CornerPiece | EdgePiece | null>(null);
  const [currAnswer, setCurrAnswer] = useState<Sticker | null>(null);
  const [answerList, setAnswerList] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<number>(0); // 0-6 based even odd for edge flip, % 3 for corner and edge orientation

  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTimeStartedRef = useRef<boolean>(false);

  useEffect(() => {

    nextPiece(); // get initial piece

    if (mode == "time-trial") {
      console.log("starting timer from use effect")
      console.log(mode, timeTrialDuration, pieceCount, pieceTypes)
      setClock(timeTrialDuration);
      startTimer();
    } else if (mode == "piece-count") {
      // so something else
      console.log("starting piece count mode");
      setClock(0);
      startStopwatch();
    }
    setSessionStarted(true);
  }, []);

  useEffect(() => {
    console.log(mode, questionsAnswered, pieceCount)
    if (mode == "piece-count" && questionsAnswered == pieceCount) {
      setSessionOver(true);
    }
  }, [questionsAnswered, mode])

  const startTimer = () => {
    if (hasTimeStartedRef.current) {
      return;
    }
    hasTimeStartedRef.current = true
    intervalRef.current = setInterval(() => {
      setClock(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setSessionOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  const startStopwatch = () => {
    if (hasTimeStartedRef.current) {
      return;
    }
    hasTimeStartedRef.current = true
    intervalRef.current = setInterval(() => {
      setClock(t => t + 1);
    }, 1000);
  }

  function resetGame() {
    // setCountdown(3);
    setSessionStarted(false);
    setSessionOver(false);
    setClock(-1);
  }

  const pauseSession = useCallback(() => {
    clearInterval(intervalRef.current!);
    hasTimeStartedRef.current = false;
    setSessionPaused(true);
  }, [intervalRef, setSessionPaused]);

  const resumeSession = useCallback(() => {
    if (mode == "time-trial") {
      startTimer();
    } else if (mode == "piece-count") {
      startStopwatch();
    } else {
      throw Error("useTrainer.tsx - resumeSession() - Invalid mode");
    }
    setSessionPaused(false);
  }, [setSessionPaused]);

  const getCurrPieceView = () => {
    if (!currPiece) {
      return;
    }
    if (currPiece.length == 3) {
      return PieceViews.getRandomCornerPieceView([currPiece[0].color, currPiece[1].color, currPiece[2].color], orientation);
    } else {
      return PieceViews.getRandomEdgePieceView([currPiece[0].color, currPiece[1].color], orientation);
    }
  }

  const randomizeAnswerOrder = (answers: string[]): string[] => {
    let randAns = [...answers];
    for (let i = randAns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randAns[i], randAns[j]] = [randAns[j], randAns[i]];
    }
    return randAns;
  }

  const generateAnswerList = (piece: CornerPiece | EdgePiece, answer: Sticker): string[] => {
    // for now just use randomized list of memos of the same face
    if (!answer || !piece) {
      throw Error("useTrainer.tsx - generateAnswerList() - curr answer or currPiece is null");
    }
    if (piece.length == 3) {
      return randomizeAnswerOrder(memoScheme[answer.face].corners);
    } else {
      return randomizeAnswerOrder(memoScheme[answer.face].edges);
    }
  }

  /**
   * Sets currPiece to a newly generated piece (not the view)
   * Also sets the orientation
   * Also sets the answer sticker (color and memo)
   * Also generates answer list (includes correct answer)
   */
  const nextPiece = () => {
    setOrientation(Math.floor(Math.random() * 6)); // randomize orientation
    let p = -1
    if (pieceTypes == "corners+edges") {
      p = Math.floor(Math.random() * 2);
    }

    if (pieceTypes == "corners" || p == 0) {
      let c = cube.sampleCornerPiece();
      setCurrPiece(c);
      let ans = c[Math.floor(Math.random() * 3)]
      setCurrAnswer(ans);
      setAnswerList(generateAnswerList(c, ans));
    } else if (pieceTypes == "edges" || p == 1) {
      let e = cube.sampleEdgePiece();
      setCurrPiece(e);
      let ans = e[Math.floor(Math.random() * 2)]
      setCurrAnswer(ans);
      setAnswerList(generateAnswerList(e, ans));
    } else {
      throw Error("useTrainer.tsx - nextPiece() - No such next piece")
    }
  }

  const answerQuestion = (answer: string): string => {
    if (!currAnswer) {
      throw Error("useTrainer.tsx - answerQuestion() - currAnswer is undefined")
    }
    setQuestionsAnswered(n => n + 1);
    if (answer == currAnswer.memo) {
      setCorrectAnswers(n => n + 1);
    }

    return currAnswer.memo;
  }


  return {
    sessionStarted,
    sessionOver,
    pauseSession,
    resumeSession,
    sessionPaused,
    clock,
    currPiece,
    currAnswer,
    getCurrPieceView,
    answerList,
    nextPiece,
    answerQuestion,
    questionsAnswered,
    correctAnswers,
  };
}
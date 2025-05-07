import { useState, useEffect, useRef, useMemo, JSX } from "react";
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
  const [timer, setTimer] = useState<number>(timeTrialDuration);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [currPiece, setCurrPiece] = useState<CornerPiece | EdgePiece | null>(null);
  const [currAnswer, setCurrAnswer] = useState<Sticker | null>(null);
  const [orientation, setOrientation] = useState<number>(0); // 0-6 based even odd for edge flip, % 3 for corner and edge orientation

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTimerStartedRef = useRef<boolean>(false);

  useEffect(() => {
    if (hasTimerStartedRef.current) {
      return;
    }
    hasTimerStartedRef.current = true

    console.log("calling nextPiece")
    nextPiece();

    if (mode == "time-trial") {
      console.log("starting timer from use effect")
      console.log(mode, timeTrialDuration, pieceCount, pieceTypes)
      startTimer();
    } else if (mode == "piece-count") {
      // so something else
      console.log("starting piece count mode");
    }
  }, [])

  function startTimer() {
    console.log("starting timer")
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setSessionOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  // function answerQuestion() {
  //   if (mode === "questions") {
  //     const next = questionIndex + 1;
  //     if (next >= totalQuestions) {
  //       setGameOver(true);
  //     } else {
  //       setQuestionIndex(next);
  //     }
  //   }
  // }

  function resetGame() {
    // setCountdown(3);
    setSessionStarted(false);
    setSessionOver(false);
    setTimer(timeTrialDuration);
    setQuestionIndex(0);
  }

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

  /**
   * Sets currPiece to a newly generated piece (not the view)
   * Also sets the orientation
   * Also sets the answer sticker (color and memo)
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
      setCurrAnswer(c[Math.floor(Math.random() * 3)]);
    } else if (pieceTypes == "edges" || p == 1) {
      let e = cube.sampleEdgePiece();
      setCurrPiece(e);
      setCurrAnswer(e[Math.floor(Math.random() * 2)]);
    } else {
      throw Error("useTrainer.tsx - nextPiece() - No such next piece")
    }
  }

  return {
    sessionStarted,
    sessionOver,
    timer,
    questionIndex,
    getCurrPieceView,
    nextPiece,
  };
}
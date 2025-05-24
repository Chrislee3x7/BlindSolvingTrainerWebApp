import { useCallback, useEffect, useRef, useState } from "react";
import { MemoSchemeType, MemoSchemeUtils, PieceType } from "./MemoScheme";
import { Button } from "./components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Label } from "./components/ui/label";
import { useTrainer } from "./useTrainer";
import { useDialog } from "./dialog/useDialog";

export type TrainingSettings = {
  mode: "time-trial" | "piece-count";
  timeTrialDuration: number;
  pieceCount: number;
  pieceTypes: "corners" | "edges" | "corners+edges";
}

export const createDefaultTrainingSettings = (): TrainingSettings => {
  return {
    mode: "time-trial",
    timeTrialDuration: 30,
    pieceCount: 10,
    pieceTypes: "corners"
  } as TrainingSettings
};

type TrainingScreenProps = {
  memoScheme: MemoSchemeType;
  settings: TrainingSettings
  backToMemoSetup: () => void;
};

const TrainingScreen = ({ memoScheme, backToMemoSetup, settings }: TrainingScreenProps) => {

  const trainer = useTrainer({ settings, memoScheme });
  const { dialog: pauseDialog } = useDialog();

  const [correctAnswerLabel, setCorrectAnswerLabel] = useState<string>("?");
  const [showAnswerCorrect, setShowAnswerCorrect] = useState<boolean>(false);
  const [showAnswerWrong, setShowAnswerWrong] = useState<boolean>(false);

  const onAnswerInputted = useCallback((answer: string) => {
    let a: string = answer.toUpperCase();
    if (!trainer.currAnswer || !trainer.currPiece) {
      throw Error("TrainingScreen.tsx - onAnswerInputted() - trainer.currAnswer or trainer.currPiece is undefined")
    }
    let correctAnswer: string = trainer.answerQuestion(a);

    // set the question mark to the right letter
    setCorrectAnswerLabel(correctAnswer);
    if (correctAnswer == answer) {
      setShowAnswerCorrect(true)
    } else {
      setShowAnswerWrong(true)
    }

  }, [trainer]);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (correctAnswerLabel != "?") { // start timer if we have "?" as the anwer right now
      timer = setTimeout(() => {
        // hide both green and red background filter
        setShowAnswerCorrect(false)
        setShowAnswerWrong(false)
        setCorrectAnswerLabel("?")
        trainer.nextPiece();
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [correctAnswerLabel]);

  const onAnswerInputtedRef = useRef(onAnswerInputted);

  // Always keep the ref updated with the latest function
  useEffect(() => {
    onAnswerInputtedRef.current = onAnswerInputted;
  }, [onAnswerInputted]);

  const onPause = useCallback(() => {
    trainer.pauseSession();
    pauseDialog({
      title: "Training Paused",
      description: "",
      actionLabel: "Quit",
      blurBackground: true,
      actionVariant: "destructive",
      cancelLabel: "Cancel",
      onConfirm: () => {
        backToMemoSetup();
      },
      onCancel: () => {
        trainer.resumeSession();
        console.log("resume session called from dialog");
      },
      children: (
        <div>
          <Label>{JSON.stringify(settings)}</Label>
        </div>
      )
    });
  }, [trainer]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let key = e.key;
    if (key === 'Escape' && !trainer.sessionPaused) {
      // show dialog with "paused", current mode, time, resume / restart / go to memo scheme setup
      onPause();
    } else if (MemoSchemeUtils.isValidMemo(key)) {
      onAnswerInputtedRef.current(key)
    }
  }, [trainer.sessionPaused])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (trainer.sessionOver) {
      backToMemoSetup();
    }
  }, [trainer.sessionOver]);

  return (
    <div className="flex flex-col h-full w-full gap-2">
      {showAnswerCorrect && <div className="absolute h-full w-full bg-lime-300 opacity-50"></div>}
      {showAnswerWrong && <div className="absolute h-full w-full bg-red-500 bg opacity-50"></div>}
      <div className="dynamic-vertical-layout grow items-center">
        <div className="flex grow content-center justify-center items-center" style={{ height: "66%" }}>
          {trainer.getCurrPieceView()}
        </div>

        <div className="flex dynamic-horizontal-layout flex-3 p-4 w-full h-full justify-center items-center content-center bg-teal-700 rounded-tl-3xl">
          <div className="flex aspect-square px-16 border-8 border-black rounded-3xl justify-center content-center" style={{ backgroundColor: trainer.currAnswer?.color }}>
            <Label style={{ fontSize: '32px' }}>{correctAnswerLabel}</Label>
          </div>
          <div className="flex flex-row w-1/2 gap-2 m-4">
            <div className="flex flex-1 flex-col gap-2 h-full">
              <Button className="grow" onClick={() => { onAnswerInputted(trainer.answerList[0]) }}>
                <Label style={{ fontSize: '32px' }}>{trainer.answerList[0]}</Label>
              </Button>
              <Button className="grow" onClick={() => { onAnswerInputted(trainer.answerList[1]) }}>
                <Label style={{ fontSize: '32px' }}>{trainer.answerList[1]}</Label>
              </Button>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Button className="grow" onClick={() => { onAnswerInputted(trainer.answerList[2]) }}>
                <Label style={{ fontSize: '32px' }}>{trainer.answerList[2]}</Label>
              </Button>
              <Button className="grow" onClick={() => { onAnswerInputted(trainer.answerList[3]) }}>
                <Label style={{ fontSize: '32px' }}>{trainer.answerList[3]}</Label>
              </Button>
            </div>
          </div>
          <div className="grow"></div>
          <div className="flex gap-8 flex-row">
            <Label className="font-bold">{trainer.clock}</Label>
            <div className="grow"></div>
            <Button onClick={trainer.nextPiece}>Generate Next Piece</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainingScreen;
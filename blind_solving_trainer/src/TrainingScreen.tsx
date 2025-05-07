import { useCallback, useEffect, useState } from "react";
import { MemoSchemeType, PieceType } from "./MemoScheme";
import { Button } from "./components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Label } from "./components/ui/label";
import { useTrainer } from "./useTrainer";

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

  const [color1, setColor1] = useState<string>("red");
  const [color2, setColor2] = useState<string>("white");

  const trainer = useTrainer({ settings, memoScheme });


  // useEffect(() => {
  //   const colorTestInterval = setInterval(() => {
  //     setColor1('#' + Math.floor(Math.random() * 16777215).toString(16));
  //     setColor2('#' + Math.floor(Math.random() * 16777215).toString(16));
  //   }, 1000);

  //   return () => {
  //     clearInterval(colorTestInterval)
  //   }
  // }, [])

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex">
        <Button className="flex m-4" onClick={backToMemoSetup}>
          <ChevronLeft />
          <Label>Back</Label>
        </Button>
      </div>
      <div className="dynamic-vertical-layout grow items-center">
        <div className="flex grow content-center justify-center items-center" style={{ height: "66%" }}>
          {trainer.getCurrPieceView()}
        </div>
        <div className="flex-3 w-full h-full justify-center items-center content-center bg-teal-700 rounded-tl-3xl">
          <Label>{trainer.timer}</Label>
          <Button onClick={trainer.nextPiece}>Generate Next Piece</Button>
        </div>
      </div>
    </div>
  );
}

export default TrainingScreen;
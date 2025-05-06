import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrainingSettings } from "./TrainingScreen";

type TrainingSetupFormProps = {
  onChange?: (data: any) => void;
  prevTrainingSettings: TrainingSettings;
}

export const TrainingSetupForm: React.FC<TrainingSetupFormProps> = ({
  onChange,
  prevTrainingSettings
}) => {
  const [mode, setMode] = useState<string>(prevTrainingSettings.mode);

  const [timeTrialDuration, setTimeTrialDuration] = useState<string>(prevTrainingSettings.timeTrialDuration?.toString())
  const [pieceCount, setPieceCount] = useState<string>(prevTrainingSettings.pieceCount.toString());

  const [pieceTypes, setPieceTypes] = useState<"corners" | "edges" | "corners+edges">(prevTrainingSettings.pieceTypes);


  // Call parent with latest values
  useEffect(() => {
    if (onChange) {
      onChange({
        mode: mode,
        timeTrialDuration: parseInt(timeTrialDuration),
        pieceCount: parseInt(pieceCount),
        pieceTypes: pieceTypes
      } as TrainingSettings);
    }
  }, [mode, timeTrialDuration, pieceCount, pieceTypes])

  return (
    <div className="grid gap-4 py-4">
      <div className="flex flex-row space-x-2">
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="time-trial">Time Trial</SelectItem>
            <SelectItem value="piece-count">Piece Count</SelectItem>
          </SelectContent>
        </Select>
        {mode == "time-trial" &&
          <Select value={timeTrialDuration} onValueChange={setTimeTrialDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="60">60</SelectItem>
              <SelectItem value="90">90</SelectItem>
              <SelectItem value="120">120</SelectItem>
            </SelectContent>
          </Select>
        }
        {mode == "piece-count" &&
          <Select value={pieceCount} onValueChange={setPieceCount}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
            </SelectContent>
          </Select>
        }
        <Label>{mode == "time-trial" ? "seconds" : "pieces"}</Label>
      </div>
      <Select value={pieceTypes} onValueChange={(s: string) => setPieceTypes(s as "corners" | "edges" | "corners+edges")}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="corners">Corners Only</SelectItem>
          <SelectItem value="edges">Edges Only</SelectItem>
          <SelectItem value="corners+edges">Corners and Edges</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
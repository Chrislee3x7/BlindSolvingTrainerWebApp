import React from "react";
import { Button } from "@/components/ui/button"
import { PieceType } from "./MemoScheme";
import { useDialog } from "./dialog/useDialog";
import { Label } from "./components/ui/label";

type ControlPanelProps = {
  memoMode: PieceType
  toggleMemoMode: () => void
  resetToDefaultMemoScheme: () => void
  startTraining: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({ toggleMemoMode, memoMode, resetToDefaultMemoScheme, startTraining }) => {

  const { dialog: confirmResetMemoSchemeDialog } = useDialog();

  const handleDefaultMemosClick = () => {
    // show dialog to create game
    confirmResetMemoSchemeDialog({
      title: "Confirm Reset",
      description: "Are you sure you want to reset your memo scheme to the default? You can't undo this action!",
      actionLabel: "Confirm",
      actionVariant: "destructive",
      cancelLabel: "Cancel",
      onConfirm: () => {
        resetToDefaultMemoScheme();
      }
    });

  }

  return (
    <div style={{ height: '100%', flex: 1, alignContent: 'center' }}>
      <div className="bg-teal-700 rounded-l-3xl" style={{
        display: 'flex', flexDirection: 'column', padding: "30px 30px", rowGap: "15px",
      }}>
        <Button variant="destructive" onClick={handleDefaultMemosClick}>
          <Label>Default Memos</Label>
        </Button>
        <Button onClick={toggleMemoMode}>
          <Label>{memoMode + 's'}</Label>
        </Button>
        <Button onClick={startTraining}>
          <Label>Start Training</Label>
        </Button>
      </div>
    </div>
  )
}

export default ControlPanel;
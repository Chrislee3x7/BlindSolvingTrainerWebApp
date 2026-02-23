import React from "react";
import { Button } from "@/components/ui/button"
import { PieceType } from "./MemoScheme";
import { useDialog } from "./dialog/useDialog";
import { Label } from "./components/ui/label";
import { useBluetooth } from "./bluetooth/BluetoothContext";

type ControlPanelProps = {
  memoMode: PieceType
  toggleMemoMode: () => void
  resetToDefaultMemoScheme: () => void
  startTraining: () => void
  showCubeViz: () => void
  showBluetoothScreen: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({ toggleMemoMode, memoMode, resetToDefaultMemoScheme, startTraining, showCubeViz, showBluetoothScreen }) => {

  const { dialog: confirmResetMemoSchemeDialog } = useDialog();
  const { handleConnect, isConnected } = useBluetooth();

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

  const handleBluetoothClick = () => {
    if (isConnected) {
      showBluetoothScreen();
    } else {
      handleConnect();
    }
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
        <Button onClick={showCubeViz}>
          <Label>Cube Viz</Label>
        </Button>
        <Button onClick={handleBluetoothClick}>
          <Label>{isConnected ? 'Bluetooth' : 'Connect Cube'}</Label>
        </Button>
      </div>
    </div>
  )
}

export default ControlPanel;
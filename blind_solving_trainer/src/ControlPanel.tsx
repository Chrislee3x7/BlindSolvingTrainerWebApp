import React from "react";
import { Button } from "@/components/ui/button"
import { StickerType } from "./MemoScheme";

interface ControlPanelProps {
  memoMode: StickerType
  toggleMemoMode: () => void
  resetToDefaultMemoScheme: () => void
  startTraining: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({ toggleMemoMode, memoMode, resetToDefaultMemoScheme, startTraining }) => {
  return (
    <div style={{ height: '100%', flex: 1, alignContent: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', padding: "30px 30px", rowGap: "10px",
        backgroundColor: 'rgb(100, 150, 150)', borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px"
      }}>
        <Button variant="destructive" onClick={resetToDefaultMemoScheme}>
          <h2>default memos</h2>
        </Button>
        <Button onClick={toggleMemoMode}>
          <h2>{memoMode}</h2>
        </Button>
        <Button onClick={startTraining}>
          <h2>start training</h2>
        </Button>
      </div>
    </div>
  )
}

export default ControlPanel;
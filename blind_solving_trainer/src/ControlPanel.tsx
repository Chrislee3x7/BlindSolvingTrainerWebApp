import React from "react";
import { StickerType } from "./MemoScheme";

interface ControlPanelProps {
  memoMode: StickerType
  toggleMemoMode: () => void
  resetToDefaultMemoScheme: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({ toggleMemoMode, memoMode, resetToDefaultMemoScheme }) => {
  return (
    <div style={{ height: '100%', flex: 1, alignContent: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', padding: "30px 30px", rowGap: "10px",
        backgroundColor: 'black', borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px"
      }}>
        <button style={{ width: '100%' }} onClick={resetToDefaultMemoScheme}>
          <h2>default memos</h2>
        </button>
        <button style={{ width: '100%' }} onClick={toggleMemoMode}>
          <h2>{memoMode}</h2>
        </button>
        <button style={{ width: '100%' }}>
          <h2>start training</h2>
        </button>
      </div>
    </div>
  )
}

export default ControlPanel;
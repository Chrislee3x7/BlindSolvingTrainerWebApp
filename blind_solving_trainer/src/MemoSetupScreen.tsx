import { useCallback, useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import CubeNet from "./CubeNet";
import { MemoSchemeType, MemoSchemeUtils, StickerId, PieceType } from "./MemoScheme";

interface MemoSetupScreenProps {
  memoScheme: MemoSchemeType;
  setMemoScheme: React.Dispatch<React.SetStateAction<MemoSchemeType>>
  startTraining: () => void;
};

const MemoSetupScreen: React.FC<MemoSetupScreenProps> = ({ memoScheme, setMemoScheme, startTraining }) => {
  const [memoMode, setMemoMode] = useState<PieceType>(PieceType.CORNER);

  const [editingSticker, setEditingSticker] = useState<StickerId | null>(null);

  const handleStickerClick = useCallback((stickerId: StickerId | null) => {
    if (stickerId == null || stickerId.type != memoMode) {
      setEditingSticker(null)
      return
    }
    setEditingSticker((prev) =>
      JSON.stringify(prev) === JSON.stringify(stickerId) ? null : stickerId
    );
  }, [memoMode]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (editingSticker == null) {
        return;
      }

      let key = event.key;

      if (key === 'Escape') {
        setEditingSticker(null);
      } else if (MemoSchemeUtils.isValidMemo(key)) {
        setMemoScheme(MemoSchemeUtils.validateMemoScheme(
          MemoSchemeUtils.updateMemoScheme(memoScheme, editingSticker, key.toUpperCase())));
        setEditingSticker(null);
      }
    },
    [editingSticker]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const toggleMemoMode = () => {
    setMemoMode(prev => prev == PieceType.CORNER ? PieceType.EDGE : PieceType.CORNER)
  }

  return (
    <>
      <CubeNet memoMode={memoMode}
        memoScheme={memoScheme}
        editingSticker={editingSticker}
        handleStickerClick={handleStickerClick} />
      <ControlPanel toggleMemoMode={toggleMemoMode} memoMode={memoMode}
        resetToDefaultMemoScheme={() => { setMemoScheme(MemoSchemeUtils.createDefault()); setEditingSticker(null) }}
        startTraining={startTraining} />
    </>
  );
}

export default MemoSetupScreen;
import { useCallback, useEffect, useState } from 'react'
import CubeNet from './CubeNet'
import { MemoSchemeType, MemoSchemeUtils, StickerId, StickerType } from './MemoScheme'
import ControlPanel from './ControlPanel'

function App() {
  const [memoMode, setMemoMode] = useState<StickerType>(StickerType.CORNER)
  const [memoScheme, setMemoScheme] = useState<MemoSchemeType>(MemoSchemeUtils.createDefault());
  const [editingSticker, setEditingSticker] = useState<StickerId | null>(null);

  // handle sticker click
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
    setMemoMode(prev => prev == StickerType.CORNER ? StickerType.EDGE : StickerType.CORNER)
  }

  return (
    <div style={{
      display: 'flex',
      backgroundColor: 'rgb(175, 208, 191)',
      height: '100vh',
      // gap: '20px',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    }}>
      <CubeNet memoMode={memoMode}
        memoScheme={memoScheme}
        editingSticker={editingSticker}
        handleStickerClick={handleStickerClick} />
      <ControlPanel toggleMemoMode={toggleMemoMode} memoMode={memoMode}
        resetToDefaultMemoScheme={() => setMemoScheme(MemoSchemeUtils.createDefault())}
      />
    </div>
  )
}

export default App

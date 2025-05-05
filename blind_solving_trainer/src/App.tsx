import { useCallback, useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import CubeNet from './CubeNet'
import { MemoSchemeType, MemoSchemeUtils, StickerId, StickerType } from './MemoScheme'
import ControlPanel from './ControlPanel'

function App() {
  const [memoMode, setMemoMode] = useState<StickerType>(StickerType.CORNER)
  const [memoScheme, setMemoScheme] = useState<MemoSchemeType>(MemoSchemeUtils.createDefault());
  const [editingSticker, setEditingSticker] = useState<StickerId | null>(null);

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

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

  const toggleMemoMode = () => {
    setMemoMode(prev => prev == StickerType.CORNER ? StickerType.EDGE : StickerType.CORNER)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (alertVisible) {
      timer = setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    }

    return () => clearTimeout(timer)
  }, [alertVisible])

  const createAlert = (msg: string) => {
    setAlertMessage(msg)
    setAlertVisible(true)
  }

  const startTraining = () => {
    // check valid memo scheme
    if (!MemoSchemeUtils.isValidMemoScheme(memoScheme)) {
      createAlert("Cannot start training with an invalid memo scheme.");
      return;
    }

    // Start training mode
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);


  return (
    <div className="flex bg-emerald-200 items-center h-lvh">
      <Alert className={`dark transition-opacity duration-500 ${alertVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} variant="destructive">
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>
          {alertMessage}
        </AlertDescription>
      </Alert>
      <CubeNet memoMode={memoMode}
        memoScheme={memoScheme}
        editingSticker={editingSticker}
        handleStickerClick={handleStickerClick} />
      <ControlPanel toggleMemoMode={toggleMemoMode} memoMode={memoMode}
        resetToDefaultMemoScheme={() => { setMemoScheme(MemoSchemeUtils.createDefault()); setEditingSticker(null) }}
        startTraining={startTraining}
      />
    </div>
  )
}

export default App

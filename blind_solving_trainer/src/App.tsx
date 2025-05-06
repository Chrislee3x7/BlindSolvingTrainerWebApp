import { useCallback, useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import CubeNet from './CubeNet'
import { MemoSchemeType, MemoSchemeUtils, StickerId, StickerType } from './MemoScheme'
import ControlPanel from './ControlPanel'
import { AlertCircle } from 'lucide-react'
import { Cube } from './Cube'
import MemoSetupScreen from './MemoSetupScreen'
import TrainingScreen from './TrainingScreen'

function App() {

  const [memoScheme, setMemoScheme] = useState<MemoSchemeType>(MemoSchemeUtils.createDefault());

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const [screen, setScreen] = useState<string>("memo-setup");

  // handle sticker click





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

  const startTraining = useCallback(() => {
    // check valid memo scheme
    if (!MemoSchemeUtils.isValidMemoScheme(memoScheme)) {
      createAlert("Cannot start training with an invalid memo scheme. Please fix your memo scheme and try again.");
      return;
    }
    setScreen("training")
  }, [memoScheme]);



  return (
    <div className="flex bg-emerald-200 items-center h-lvh">
      <Alert className={`dark transition-opacity duration-500 ${alertVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {alertMessage}
        </AlertDescription>
      </Alert>

      {screen == "memo-setup" &&
        <MemoSetupScreen
          memoScheme={memoScheme}
          setMemoScheme={setMemoScheme}
          startTraining={startTraining} />
      }
      {screen == "training" &&
        <TrainingScreen memoScheme={memoScheme} backToMemoSetup={() => { setScreen("memo-setup") }} />
      }

    </div>
  )
}

export default App

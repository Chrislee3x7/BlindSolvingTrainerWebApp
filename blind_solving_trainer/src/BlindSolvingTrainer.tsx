import { useCallback, useEffect, useState } from 'react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MemoSchemeType, MemoSchemeUtils } from './MemoScheme'
import { AlertCircle } from 'lucide-react'
import MemoSetupScreen from './MemoSetupScreen'
import TrainingScreen, { createDefaultTrainingSettings, TrainingSettings } from './TrainingScreen'
import { useDialog } from "./dialog/useDialog";
import { TrainingSetupForm } from './TrainingSetupForm'
import CubeVizScreen from './CubeVizScreen';
import BluetoothScreen from './BluetoothScreen';
import StatusIndicator from './StatusIndicator';

function BlindSolvingTrainer() {

  const [screen, setScreen] = useState<string>("memo-setup");

  const [memoScheme, setMemoScheme] = useState<MemoSchemeType>(MemoSchemeUtils.createDefault());

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  const { dialog: trainingSetupDialog } = useDialog();

  const [trainingSettings, setTrainingSettings] = useState<TrainingSettings>(createDefaultTrainingSettings());


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

  const handleStartTrainingClick = useCallback(() => {
    // check valid memo scheme
    if (!MemoSchemeUtils.isValidMemoScheme(memoScheme)) {
      createAlert("Cannot start training with an invalid memo scheme. Please fix your memo scheme and try again.");
      return;
    }

    // show dialog to create game
    trainingSetupDialog({
      title: "Start Training",
      description: "",
      actionLabel: "Start",
      actionVariant: "default",
      cancelLabel: "Cancel",
      onConfirm: () => {
        startTraining();
      },
      children: (
        <TrainingSetupForm
          onChange={(s: TrainingSettings) => { setTrainingSettings(s) }}
          prevTrainingSettings={trainingSettings}
        />
      )
    });

  }, [memoScheme, trainingSettings]);

  const startTraining = useCallback(() => {
    setScreen("training");
  }, [])

  const showCubeViz = useCallback(() => {
    setScreen("cube-viz");
  }, [])

  const showBluetoothScreen = useCallback(() => {
    setScreen("bluetooth-screen");
  }, [])



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
        <>
          <StatusIndicator />
          <MemoSetupScreen
            memoScheme={memoScheme}
            setMemoScheme={setMemoScheme}
            startTraining={handleStartTrainingClick}
            showCubeViz={showCubeViz}
            showBluetoothScreen={showBluetoothScreen} />
        </>
      }
      {screen == "training" &&
        <TrainingScreen memoScheme={memoScheme} settings={trainingSettings} backToMemoSetup={() => { setScreen("memo-setup") }} />
      }
      {screen == "cube-viz" &&
        <CubeVizScreen backToMemoSetup={() => { setScreen("memo-setup") }} />
      }
      {screen == "bluetooth-screen" &&
        <BluetoothScreen backToMemoSetup={() => { setScreen("memo-setup") }} />
      }
    </div>
  )
}

export default BlindSolvingTrainer

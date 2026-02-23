import { DialogProvider } from './dialog/DialogProvider'
import BlindSolvingTrainer from './BlindSolvingTrainer'
import { BluetoothProvider } from './bluetooth/BluetoothContext'

function App() {

  return (
    <DialogProvider>
      <BluetoothProvider>
        <BlindSolvingTrainer />
      </BluetoothProvider>
    </DialogProvider>
  )
}

export default App

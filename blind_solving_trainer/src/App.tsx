import { DialogProvider } from './dialog/DialogProvider'
import BlindSolvingTrainer from './BlindSolvingTrainer'

function App() {

  return (
    <DialogProvider>
      <BlindSolvingTrainer />
    </DialogProvider>
  )
}

export default App

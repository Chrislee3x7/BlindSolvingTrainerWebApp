
import React, { useState, useEffect, useRef } from 'react';
import { TwistyPlayer } from 'cubing/twisty';
import { Button } from '@/components/ui/button';

interface CubeVizScreenProps {
  backToMemoSetup: () => void;
}

const CubeVizScreen: React.FC<CubeVizScreenProps> = ({ backToMemoSetup }) => {
  const [alg, setAlg] = useState("R U R' U'");
  const playerRef = useRef<TwistyPlayer>(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.alg = alg;
    }
  }, [alg]);

  const handleAlgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlg(e.target.value);
  };

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-2xl mb-4">Cube Visualization</h1>
      <twisty-player
        ref={playerRef}
        alg={alg}
        visualization="3D"
        control-panel="none"
        style={{ width: '300px', height: '300px' }}
      ></twisty-player>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={alg}
          onChange={handleAlgChange}
          className="border p-2 rounded mr-2"
        />
        <Button onClick={handlePlay} className="mr-2">Play</Button>
        <Button onClick={handlePause}>Pause</Button>
      </div>
      <Button onClick={backToMemoSetup} className="mt-4">Back to Memo Setup</Button>
    </div>
  );
};

export default CubeVizScreen;


import React, { useState, useEffect, useRef } from 'react';
import { TwistyPlayer } from 'cubing/twisty';
import { Button } from '@/components/ui/button';

// Define the custom element if it hasn't been defined yet.
if (!customElements.get('twisty-player')) {
  customElements.define('twisty-player', TwistyPlayer);
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'twisty-player': React.DetailedHTMLProps<React.HTMLAttributes<TwistyPlayer>, TwistyPlayer>;
    }
  }
}

type CubeVizScreenProps = {
  backToMemoSetup: () => void;
}

const CubeVizScreen: React.FC<CubeVizScreenProps> = ({ backToMemoSetup }) => {
  const [alg, setAlg] = useState("R U R' U R U2' R'");
  const [inputValue, setInputValue] = useState("R U R' U R U2' R'");

  const handleAlgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleApplyClick = () => {
    setAlg(inputValue);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleAlgChange}
          className="border border-gray-300 rounded-md px-2 py-1 mr-2"
        />
        <Button onClick={handleApplyClick}>Apply</Button>
      </div>
      <twisty-player
        alg={alg}
        puzzle="3x3x3"
        visualization="3D"
      ></twisty-player>
      <Button onClick={backToMemoSetup} className="mt-4">Back to Memo Setup</Button>
    </div>
  );
};

export default CubeVizScreen;

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useBluetooth } from './bluetooth/BluetoothContext';
import { TwistyPlayer } from 'cubing/twisty';

if (!customElements.get('twisty-player')) {
  customElements.define('twisty-player', TwistyPlayer);
}

interface BluetoothScreenProps {
  backToMemoSetup: () => void;
}

const BluetoothScreen: React.FC<BluetoothScreenProps> = ({ backToMemoSetup }) => {
  const { status, moves, handleConnect, handleDisconnect, clearMoves, lastMove, isConnected } = useBluetooth();
  const playerRef = useRef<TwistyPlayer>(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.alg = moves.join(" ");
    }
  }, [moves]);

  const getStatusIndicatorColor = () => {
    if (isConnected) {
      return 'bg-green-500';
    }
    if (status.startsWith('Error') || status === 'Disconnected') {
      return 'bg-red-500';
    }
    if (status.includes('...')) {
      return 'bg-yellow-500';
    }
    return 'bg-gray-500'; // Default color
  };

  const handleResetCube = () => {
    clearMoves();
    if (playerRef.current) {
      playerRef.current.alg = "";
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={backToMemoSetup} variant="outline">Back</Button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusIndicatorColor()}`}>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
          </div>
          {isConnected ? (
            <Button onClick={handleDisconnect} variant="destructive">Disconnect</Button>
          ) : (
            <Button onClick={handleConnect} variant="secondary">Connect</Button>
          )}
        </div>
      </div>

      <div className="flex-grow flex space-x-4">
        <div className="w-1/2 flex flex-col space-y-4">
          {/* Cube Visualization Section */}
          <div className="flex-grow border rounded-lg flex justify-center items-center bg-gray-50 dark:bg-gray-800">
            <twisty-player
              background="none"
              ref={playerRef}
              puzzle="3x3x3"
              camera-distance="6"
              control-panel="none"
              className="w-full h-full"
            ></twisty-player>
          </div>
          <Button onClick={handleResetCube} variant="secondary">Reset Cube</Button>
        </div>

        <div className="w-1/2 flex flex-col space-y-4">
          {/* Last Move Section */}
          <div className="h-32 flex-shrink-0 flex flex-col justify-center items-center border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <p className="font-mono text-5xl text-center h-16">
              {lastMove || "-"}
            </p>
            <h3 className="font-bold text-center">Last Move</h3>
          </div>

          {/* Move History Section */}
          <div className="flex-grow flex flex-col border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-baseline mb-2">
              <h2 className="text-lg font-semibold">Move History</h2>
              <Button onClick={clearMoves} disabled={moves.length === 0} variant="secondary" size="sm">Clear</Button>
            </div>
            <div className="flex-grow overflow-y-auto font-mono text-lg" style={{ wordBreak: 'break-word' }}>
              {moves.join(" ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluetoothScreen;

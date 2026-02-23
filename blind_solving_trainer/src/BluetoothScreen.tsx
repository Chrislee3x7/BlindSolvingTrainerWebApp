import React from 'react';
import { Button } from '@/components/ui/button';
import { useBluetooth } from './bluetooth/BluetoothContext';

interface BluetoothScreenProps {
  backToMemoSetup: () => void;
}

const BluetoothScreen: React.FC<BluetoothScreenProps> = ({ backToMemoSetup }) => {
  const { status, moves, handleConnect, handleDisconnect, clearMoves, lastMove, isConnected } = useBluetooth();

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
        {/* Last Move Section */}
        <div className="w-48 flex-shrink-0 flex flex-col justify-center items-center border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
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
            {moves.map(move => move.length === 1 ? move + " " : move).join(" ")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluetoothScreen;

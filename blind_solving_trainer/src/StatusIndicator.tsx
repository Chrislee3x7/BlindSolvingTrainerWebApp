import React from 'react';
import { useBluetooth } from './bluetooth/BluetoothContext';

const StatusIndicator: React.FC = () => {
  const { status, isConnected } = useBluetooth();

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
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <div className="flex items-center space-x-2 bg-white p-2 rounded-full shadow-lg">
        <div className={`w-3 h-3 rounded-full ${getStatusIndicatorColor()}`}>
        </div>
        <p className="text-sm text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default StatusIndicator;

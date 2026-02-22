
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BluetoothScreenProps {
  backToMemoSetup: () => void;
}

const BluetoothScreen: React.FC<BluetoothScreenProps> = ({ backToMemoSetup }) => {
  const [status, setStatus] = useState("Disconnected");
  const [lastMove, setLastMove] = useState("");
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [macAddress, setMacAddress] = useState("");

  const handleDisconnect = useCallback(async () => {
    if (connectedDevice && connectedDevice.gatt?.connected) {
      setStatus("Disconnecting...");
      connectedDevice.gatt.disconnect();
      setConnectedDevice(null);
      setLastMove("");
      setStatus("Disconnected");
    }
  }, [connectedDevice]);

  const handleConnect = useCallback(async () => {
    try {
      setStatus("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['00000010-0000-fff7-fff6-fff5fff4fff0']
      });

      if (!device.gatt) {
        setStatus("Error: No GATT server found on device.");
        return;
      }

      setConnectedDevice(device);

      device.addEventListener('gattserverdisconnected', () => {
        setStatus("Disconnected");
        setConnectedDevice(null);
        setLastMove("");
      });

      setStatus("Connecting to GATT Server...");
      const server = await device.gatt.connect();

      setStatus("Getting Service...");
      const service = await server.getPrimaryService('00000010-0000-fff7-fff6-fff5fff4fff0');

      setStatus("Getting Characteristics...");
      const notifyChar = await service.getCharacteristic('0000fff6-0000-1000-8000-00805f9b34fb');
      const writeChar = await service.getCharacteristic('0000fff5-0000-1000-8000-00805f9b34fb');

      setStatus("Starting notifications...");
      await notifyChar.startNotifications();

      notifyChar.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (value) {
          const hexString = Array.from(new Uint8Array(value.buffer)).map(b => b.toString(16).padStart(2, '0')).join(' ');
          setLastMove(`Raw Data: ${hexString}`);
        }
      });

      setStatus("Sending wakeup command...");
      await writeChar.writeValue(new Uint8Array([0xb0]));

      setStatus("Connected and listening. Try turning the cube!");

    } catch (e: unknown) {
      if (e instanceof Error) {
        setStatus(`Error: ${e.message}`);
      } else {
        setStatus("An unknown error occurred");
      }
      setConnectedDevice(null);
    }
  }, []);

  useEffect(() => {
    // Clean up connection on component unmount
    return () => {
      if (connectedDevice && connectedDevice.gatt?.connected) {
        connectedDevice.gatt.disconnect();
      }
    };
  }, [connectedDevice]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-2xl mb-4">Bluetooth Connection</h1>
      <p className="mb-4">Status: {status}</p>
      {lastMove && <pre className="mb-4 p-2 bg-gray-100 rounded-md text-xs whitespace-pre-wrap">{lastMove}</pre>}
      <div className="mb-4 w-64">
        <label htmlFor="mac-address" className="block text-sm font-medium mb-1">Cube MAC Address (for reference)</label>
        <Input
          type="text"
          id="mac-address"
          value={macAddress}
          onChange={(e) => setMacAddress(e.target.value)}
          placeholder="e.g., XX:XX:XX:XX:XX:XX"
          disabled={connectedDevice !== null}
        />
      </div>
      <div className="flex space-x-4">
        <Button onClick={handleConnect} disabled={connectedDevice !== null}>Connect</Button>
        <Button onClick={handleDisconnect} disabled={connectedDevice === null}>Disconnect</Button>
        <Button onClick={backToMemoSetup}>Back to Memo Setup</Button>
      </div>
    </div>
  );
};

export default BluetoothScreen;

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GAN_ENCRYPTION_KEYS,
  GanGen4CubeEncrypter,
  GanGen4ProtocolDriver,
} from '@/lib/gan-bluetooth';
import { Subscription } from 'rxjs';

interface BluetoothScreenProps {
  backToMemoSetup: () => void;
}

const BluetoothScreen: React.FC<BluetoothScreenProps> = ({ backToMemoSetup }) => {
  const [status, setStatus] = useState("Disconnected");
  const [lastMove, setLastMove] = useState("");
  const [moves, setMoves] = useState<string[]>([]);
  const [salt, setSalt] = useState("B589BE5E3D0C"); // Pre-filled salt
  const [gattServer, setGattServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [rawData, setRawData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");

  const handleClearMoves = () => {
    setMoves([]);
  };

  const handleDisconnect = useCallback(async () => {
    if (gattServer && gattServer.connected) {
      setStatus("Disconnecting...");
      gattServer.disconnect();
      setGattServer(null);
      if (subscription) {
        subscription.unsubscribe();
        setSubscription(null);
      }
      setLastMove("");
      setRawData("");
      setMoves([]); // Clear moves on disconnect
      setStatus("Disconnected");
    }
  }, [gattServer, subscription]);

  const handleConnect = useCallback(async () => {
    // Salt is pre-filled, so no need to check if it exists

    let server: BluetoothRemoteGATTServer | null = null;
    let newSubscription: Subscription | null = null;

    try {
      // Parse the hex string salt into a Uint8Array
      const saltBytes = new Uint8Array(salt.replace(/[^0-9a-fA-F]/g, '').match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      if (saltBytes.length !== 6) {
        setStatus("Error: Salt must be 6 bytes (12 hex characters).");
        return;
      }

      setStatus("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['00000010-0000-fff7-fff6-fff5fff4fff0'],
      });

      setStatus("Connecting to GATT Server...");
      server = await device.gatt!.connect();

      setStatus("Getting Service...");
      const service = await server.getPrimaryService('00000010-0000-fff7-fff6-fff5fff4fff0');

      setStatus("Getting Characteristics...");
      const notifyChar = await service.getCharacteristic('0000fff6-0000-1000-8000-00805f9b34fb');
      const writeChar = await service.getCharacteristic('0000fff5-0000-1000-8000-00805f9b34fb');

      // --- Decoding Logic Setup ---
      const keyToUse = GAN_ENCRYPTION_KEYS[0].key;
      const ivToUse = GAN_ENCRYPTION_KEYS[0].iv;
      const encrypter = new GanGen4CubeEncrypter(new Uint8Array(keyToUse), new Uint8Array(ivToUse), saltBytes);
      const driver = new GanGen4ProtocolDriver();
      // --- End Decoding Logic Setup ---

      newSubscription = driver.events$.subscribe((event) => {
        if (event.type === "MOVE") {
          setMoves(prevMoves => [...prevMoves, event.move]);
        }
      });

      await notifyChar.startNotifications();
      notifyChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (value) {
          const rawValue = new Uint8Array(value.buffer);
          const decrypted = encrypter.decrypt(rawValue);
          const decryptedHexString = Array.from(decrypted).map(b => b.toString(16).padStart(2, '0')).join(' ');
          console.log('Decrypted:', decryptedHexString);
          setDecryptedData(`Decrypted: ${decryptedHexString}`)

          driver.handleData(decrypted);
        }
      });

      await writeChar.writeValue(new Uint8Array([0xb0]));

      setGattServer(server);
      setSubscription(newSubscription);
      setStatus("Connected and listening. Try turning the cube!");

    } catch (e: unknown) {
      if (e instanceof Error) {
        setStatus(`Error: ${e.message}`);
      } else {
        setStatus("An unknown error occurred");
      }
      if (server && server.connected) {
        server.disconnect();
      }
      if (newSubscription) {
        newSubscription.unsubscribe();
      }
      setGattServer(null);
      setSubscription(null);
    }
  }, [salt]);

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (gattServer && gattServer.connected) {
        gattServer.disconnect();
      }
    };
  }, [subscription, gattServer]);

  const getStatusIndicatorColor = (status: string) => {
    if (status.startsWith('Connected')) {
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
            <div className={`w-3 h-3 rounded-full ${getStatusIndicatorColor(status)}`}></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
          </div>
          {gattServer?.connected ? (
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
            {moves.length > 0 ? moves[moves.length - 1] : "-"}
          </p>
          <h3 className="font-bold text-center">Last Move</h3>
        </div>

        {/* Move History Section */}
        <div className="flex-grow flex flex-col border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-baseline mb-2">
            <h2 className="text-lg font-semibold">Move History</h2>
            <Button onClick={handleClearMoves} disabled={moves.length === 0} variant="secondary" size="sm">Clear</Button>
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

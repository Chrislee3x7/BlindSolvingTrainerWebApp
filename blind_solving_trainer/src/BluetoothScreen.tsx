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
  const [salt, setSalt] = useState("B589BE5E3D0C");
  const [gattServer, setGattServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [rawData, setRawData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");

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
      setStatus("Disconnected");
    }
  }, [gattServer, subscription]);

  const handleConnect = useCallback(async () => {
    if (!salt) {
      setStatus("Please enter the encryption salt.");
      return;
    }

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
          setLastMove(`Move: ${event.move}`);
        }
      });

      await notifyChar.startNotifications();
      notifyChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (value) {
          const rawValue = new Uint8Array(value.buffer);
          const rawHexString = Array.from(rawValue).map(b => b.toString(16).padStart(2, '0')).join(' ');
          setRawData(`Raw: ${rawHexString}`);

          const decrypted = encrypter.decrypt(rawValue);
          const decryptedHexString = Array.from(decrypted).map(b => b.toString(16).padStart(2, '0')).join(' ');
          // console.log('Encrypted (Raw):', rawHexString);
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

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-2xl mb-4">Bluetooth Connection</h1>
      <p className="mb-4">Status: {status}</p>
      {rawData && <p className="mb-4 font-mono text-sm text-gray-500">{rawData}</p>}
      {decryptedData && <p className="mb-4 font-mono text-sm text-gray-500">{decryptedData}</p>}
      <p className="mb-4 font-mono text-lg">{"Last Move:" + lastMove}</p>
      <div className="flex space-x-4">
        <Button onClick={handleConnect} disabled={gattServer?.connected}>
          Connect
        </Button>
        <Button onClick={handleDisconnect} disabled={!gattServer?.connected}>
          Disconnect
        </Button>
        <Button onClick={backToMemoSetup}>Back to Memo Setup</Button>
      </div>
    </div>
  );
};

export default BluetoothScreen;

import { puzzles } from 'cubing/puzzles';
import { KPuzzle } from 'cubing/kpuzzle';
import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import {
  GAN_ENCRYPTION_KEYS,
  iCarry4CubeEncrypter,
  iCarry4ProtocolDriver,
} from '@/lib/gan-bluetooth';
import { Subscription } from 'rxjs';
import { CubeStateManager } from '@/lib/CubeState';

interface BluetoothContextType {
  status: string;
  handleConnect: () => void;
  handleDisconnect: () => void;
  reset: () => void;
  cubeState: CubeStateManager | null;
  isConnected: boolean;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState("Disconnected");
  const [isConnected, setIsConnected] = useState(false);
  const [kpuzzle, setKpuzzle] = useState<KPuzzle | null>(null);
  const [cubeState, setCubeState] = useState<CubeStateManager | null>(null);
  const [salt] = useState("B589BE5E3D0C"); // Pre-filled salt
  const [gattServer, setGattServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    puzzles["3x3x3"].kpuzzle().then(setKpuzzle);
  }, []);

  useEffect(() => {
    if (kpuzzle) {
      setCubeState(new CubeStateManager(kpuzzle));
    }
  }, [kpuzzle]);

  const reset = () => {
    if (kpuzzle) {
      setCubeState(new CubeStateManager(kpuzzle));
    }
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
      reset(); // reset cube state on disconnect
      setStatus("Disconnected");
      setIsConnected(false);
    }
  }, [gattServer, subscription]);

  const handleConnect = useCallback(async () => {
    let server: BluetoothRemoteGATTServer | null = null;
    let newSubscription: Subscription | null = null;

    try {
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

      const keyToUse = GAN_ENCRYPTION_KEYS[0].key;
      const ivToUse = GAN_ENCRYPTION_KEYS[0].iv;
      const encrypter = new iCarry4CubeEncrypter(new Uint8Array(keyToUse), new Uint8Array(ivToUse), saltBytes);
      const driver = new iCarry4ProtocolDriver();

      newSubscription = driver.events$.subscribe((event) => {
        if (event.type === "MOVE") {
          setCubeState(prevState => {
            if (!prevState) return null;
            return prevState.applyMove(event.move);
          });
        }
      });

      await notifyChar.startNotifications();
      notifyChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (value) {
          const rawValue = new Uint8Array(value.buffer);
          const decrypted = encrypter.decrypt(rawValue);
          driver.handleData(decrypted);
        }
      });

      await writeChar.writeValue(new Uint8Array([0xb0]));

      setGattServer(server);
      setSubscription(newSubscription);
      setStatus("Bluetooth cube connected");
      setIsConnected(true);

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
      setIsConnected(false);
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
    <BluetoothContext.Provider value={{ status, handleConnect, handleDisconnect, reset, cubeState, isConnected }}>
      {children}
    </BluetoothContext.Provider>
  );
};
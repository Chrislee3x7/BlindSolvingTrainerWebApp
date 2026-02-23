import { ModeOfOperation } from 'aes-js';
import { Observable, Subject } from 'rxjs';

// --- Start of gan-cube-definitions.ts content ---
export const GAN_ENCRYPTION_KEYS = [
    {   /** Key used by GAN Gen2, Gen3 and Gen4 cubes */
        key: [0x01, 0x02, 0x42, 0x28, 0x31, 0x91, 0x16, 0x07, 0x20, 0x05, 0x18, 0x54, 0x42, 0x11, 0x12, 0x53],
        iv: [0x11, 0x03, 0x32, 0x28, 0x21, 0x01, 0x76, 0x27, 0x20, 0x95, 0x78, 0x14, 0x32, 0x12, 0x02, 0x43]
    },
];
// --- End of gan-cube-definitions.ts content ---

// --- Start of gan-cube-encrypter.ts content ---

interface GanCubeEncrypter {
    encrypt(data: Uint8Array): Uint8Array;
    decrypt(data: Uint8Array): Uint8Array;
}

class GanGen2CubeEncrypter implements GanCubeEncrypter {
    private _key: Uint8Array;
    private _iv: Uint8Array;

    constructor(key: Uint8Array, iv: Uint8Array, salt: Uint8Array) {
        if (key.length != 16) throw new Error("Key must be 16 bytes (128-bit) long");
        if (iv.length != 16) throw new Error("Iv must be 16 bytes (128-bit) long");
        if (salt.length != 6) throw new Error("Salt must be 6 bytes (48-bit) long");
        this._key = new Uint8Array(key);
        this._iv = new Uint8Array(iv);
        for (let i = 0; i < 6; i++) {
            this._key[i] = (key[i] + salt[i]) % 0xFF;
            this._iv[i] = (iv[i] + salt[i]) % 0xFF;
        }
    }

    private encryptChunk(buffer: Uint8Array, offset: number): void {
        var cipher = new ModeOfOperation.cbc(this._key, this._iv);
        var chunk = cipher.encrypt(buffer.subarray(offset, offset + 16));
        buffer.set(chunk, offset);
    }

    private decryptChunk(buffer: Uint8Array, offset: number): void {
        var cipher = new ModeOfOperation.cbc(this._key, this._iv);
        var chunk = cipher.decrypt(buffer.subarray(offset, offset + 16));
        buffer.set(chunk, offset);
    }

    encrypt(data: Uint8Array): Uint8Array {
        if (data.length < 16) throw Error('Data must be at least 16 bytes long');
        var res = new Uint8Array(data);
        this.encryptChunk(res, 0);
        if (res.length > 16) {
            this.encryptChunk(res, res.length - 16);
        }
        return res;
    }

    decrypt(data: Uint8Array): Uint8Array {
        if (data.length < 16) throw Error('Data must be at least 16 bytes long');
        var res = new Uint8Array(data);
        if (res.length > 16) {
            this.decryptChunk(res, res.length - 16);
        }
        this.decryptChunk(res, 0);
        return res;
    }
}

export class GanGen4CubeEncrypter extends GanGen2CubeEncrypter { }

// --- End of gan-cube-encrypter.ts content ---

// --- Start of gan-cube-protocol.ts content ---

export type GanCubeMoveEvent = {
    type: "MOVE";
    serial: number;
    face: number;
    direction: number;
    move: string;
    localTimestamp: number | null;
    cubeTimestamp: number | null;
};

export type GanCubeEvent = { timestamp: number } & GanCubeMoveEvent; // Simplified for our use case

class GanProtocolMessageView {
    private bits: string;
    constructor(message: Uint8Array) {
        this.bits = Array.from(message).map(byte => (byte + 0x100).toString(2).slice(1)).join('');
    }
    getBitWord(startBit: number, bitLength: number): number {
        return parseInt(this.bits.slice(startBit, startBit + bitLength), 2);
    }
}

export class GanGen4ProtocolDriver {
    private lastSerial: number = -1;
    private lastMoveTimestamp: number = 0;
    private cubeTimestamp: number = 0;
    public events$: Subject<GanCubeEvent> = new Subject<GanCubeEvent>();

    public handleData(data: Uint8Array): void {
        const timestamp = Date.now();
        if (data.length < 2) return;

        const eventType = data[1]; // Check the second byte for the event type

        if (eventType === 0x07) { // Move event for iCarry 4
            // For debugging, convert the relevant part of the packet to a binary string.
            // We focus on bytes 2 and 3, which likely contain the move data.
            const byte2 = data[2]?.toString(2).padStart(8, '0') || "........";
            const byte3 = data[3]?.toString(2).padStart(8, '0') || "........";
            const binaryString = `Byte 2: ${byte2} | Byte 3: ${byte3}`;

            const moveEvent: GanCubeEvent = {
                type: "MOVE",
                move: binaryString, // Overload the move string for debugging
                // Dummy data for other fields
                serial: 0,
                timestamp: timestamp,
                localTimestamp: timestamp,
                cubeTimestamp: 0,
                face: 0,
                direction: 0,
            };
            this.events$.next(moveEvent);
        }
    }
}
// --- End of gan-cube-protocol.ts content ---

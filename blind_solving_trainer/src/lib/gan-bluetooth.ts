import { ModeOfOperation } from 'aes-js';
import { Observable, Subject } from 'rxjs';

// --- Start of gan-cube-definitions.ts content ---
export const GAN_ENCRYPTION_KEYS = [
    {   /** Key used by GAN Gen2, Gen3, Gen4 and iCarry4 cubes */
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

class GanCubeEncrypter implements GanCubeEncrypter {
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

export class iCarry4CubeEncrypter extends GanCubeEncrypter { }

// --- End of gan-cube-encrypter.ts content ---

// --- Start of gan-cube-protocol.ts content ---

export type GanCubeMoveEvent = {
    type: "MOVE";
    moveCount: number;
    move: string;
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

export class iCarry4ProtocolDriver {
    private lastSerial: number = -1;
    private lastMoveTimestamp: number = 0;
    private cubeTimestamp: number = 0;
    public events$: Subject<GanCubeEvent> = new Subject<GanCubeEvent>();

    public handleData(data: Uint8Array): void {
        const timestamp = Date.now();
        // A move event is at least 9 bytes long (0-8) and has 0x07 at byte 1.
        if (data.length < 9 || data[1] !== 0x07) {
            return;
        }
        // console.log("Data dycrypted:", data);

        const moveByte = data[8];

        const move = this.translateMoveByteToMove(moveByte);
        if (!move) {
            return;
        }

        const moveEvent: GanCubeEvent = {
            type: "MOVE",
            move: move,
            moveCount: data[6], // User identified byte 6 as move count
            timestamp: timestamp,
        };
        this.events$.next(moveEvent);

        // check if there is a second move by looking at byte 10
        if (data.length < 20 || data[10] !== 0x07) {
            return;
        }
        const secondMoveByte = data[17];
        const secondMove = this.translateMoveByteToMove(secondMoveByte);
        if (!secondMove) {
            return;
        }
        const secondMoveEvent: GanCubeEvent = {
            type: "MOVE",
            move: secondMove,
            moveCount: data[15], // User identified byte 6 as move count
            timestamp: timestamp,
        };
        this.events$.next(secondMoveEvent);
    }

    private translateMoveByteToMove(moveByte: number): string | undefined {
        switch (moveByte) {
            case 0x02: return "U";
            case 0x42: return "U'";
            case 0x20: return "R";
            case 0x60: return "R'";
            case 0x08: return "F";
            case 0x48: return "F'";
            case 0x10: return "L";
            case 0x50: return "L'";
            case 0x04: return "B";
            case 0x44: return "B'";
            case 0x01: return "D";
            case 0x41: return "D'";
            default: return;
        }
    }
}
// --- End of gan-cube-protocol.ts content ---

/**
Byte Mapping:
    0  01 constant move event maybe
    1  07 constant
    2  xx time
    3  xx time
    4  xx time
    5  00 maybe time
    6  xx move count (resets at ff)
    7  00 unsure
    8  xx move (R, R', U' U, F, D, etc)
    9  00 unsure
    10 00 unsure
    11 00 unsure
    12 00 unsure
    13 00 unsure
    14 00 unsure
    15 00 unsure
    16 00 unsure
    17 00 unsure
    18 xx random unsure
    19 xx random unsure
 */
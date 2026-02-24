import React, { useEffect, useState, useRef } from 'react';
import { randomScrambleForEvent } from 'cubing/scramble';
import { Alg, Move } from 'cubing/alg';
import { useBluetooth } from './bluetooth/BluetoothContext';
import { CubeStateManager } from './lib/CubeState';
import { KPuzzle, KPattern } from 'cubing/kpuzzle';
import { puzzles } from 'cubing/puzzles';
import CubeStateDisplay from './CubeStateDisplay';

interface TimerScreenProps {
    backToMemoSetup: () => void;
}

function getMovesFromAlg(alg: Alg): Move[] {
    const moveStrings = alg.expand().toString().split(' ').filter(s => s.length > 0);
    return moveStrings.map(moveString => new Move(moveString));
}

const TimerScreen: React.FC<TimerScreenProps> = ({ backToMemoSetup }) => {
    const [scramble, setScramble] = useState<Alg | null>(null);
    const [scrambleIndex, setScrambleIndex] = useState(0);
    const { cubeState: userCubeState, isConnected, reset } = useBluetooth();
    const [expectedCubeState, setExpectedCubeState] = useState<CubeStateManager | null>(null);
    const [kpuzzle, setKpuzzle] = useState<KPuzzle | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isErrorState, setIsErrorState] = useState(false);

    useEffect(() => {
        puzzles["3x3x3"].kpuzzle().then(kpuzzle => {
            setKpuzzle(kpuzzle);
            setExpectedCubeState(new CubeStateManager(kpuzzle));
        });
    }, []);

    useEffect(() => {
        if (!kpuzzle) return;
        const generateScramble = async () => {
            const newScramble = await randomScrambleForEvent("333");
            setScramble(newScramble);
            setScrambleIndex(0);
            setExpectedCubeState(new CubeStateManager(kpuzzle));
            reset();
        };

        generateScramble();
    }, [kpuzzle]);

    const scrambleIndexRef = useRef(scrambleIndex);
    scrambleIndexRef.current = scrambleIndex;

    const expectedCubeStateRef = useRef(expectedCubeState);
    expectedCubeStateRef.current = expectedCubeState;

    const isErrorStateRef = useRef(isErrorState);
    isErrorStateRef.current = isErrorState;

    useEffect(() => {
        if (!userCubeState || !scramble) return;

        const currentExpectedCubeState = expectedCubeStateRef.current;
        if (!currentExpectedCubeState) return;

        const currentScrambleIndex = scrambleIndexRef.current;
        const currentIsErrorState = isErrorStateRef.current;

        // 1. Handle error state recovery
        if (currentIsErrorState) {
            if (userCubeState.getPattern().isIdentical(currentExpectedCubeState.getPattern())) {
                setIsErrorState(false);
                setError(null);
            }
            return;
        }

        const scrambleMoves = getMovesFromAlg(scramble);
        if (currentScrambleIndex >= scrambleMoves.length) return; // Scramble complete

        const expectedMove = scrambleMoves[currentScrambleIndex];
        const finalExpectedState = currentExpectedCubeState.applyMove(expectedMove.toString());

        // 2. Check for full move completion (works for single moves and fast double moves)
        if (userCubeState.getPattern().isIdentical(finalExpectedState.getPattern())) {
            setExpectedCubeState(finalExpectedState);
            setScrambleIndex(currentScrambleIndex + 1);
            setError(null);
            return;
        }

        // 3. If not a full match, check for a partial double move
        const isDoubleMove = Math.abs(expectedMove.amount) === 2;
        if (isDoubleMove) {
            const singleMove = new Move(expectedMove.family);
            const singleMoveInverse = new Move(expectedMove.family).invert();

            const intermediateStateA = currentExpectedCubeState.applyMove(singleMove.toString());
            const intermediateStateB = currentExpectedCubeState.applyMove(singleMoveInverse.toString());

            if (userCubeState.getPattern().isIdentical(intermediateStateA.getPattern()) ||
                userCubeState.getPattern().isIdentical(intermediateStateB.getPattern())) {
                // This is a valid first half of a double move.
                // Do nothing and wait for the second half.
                setError(null);
                return;
            }
        }

        // 4. If we're here, it's a genuine error
        if (userCubeState.getMovesString().length > 0) {
            setError(`Incorrect move! Expected ${expectedMove.toString()}`);
            setIsErrorState(true);
        }
    }, [userCubeState, scramble]);

    return (
        <div className="flex flex-col h-full w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <button onClick={backToMemoSetup} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back to Menu
                </button>
                <h1 className="text-2xl font-bold">Scramble Timer</h1>
                <div style={{ width: "120px" }}></div> {/* Spacer */}
            </div>

            <div className="flex-grow flex space-x-4">
                <div className="w-1/2 flex flex-col space-y-4 items-center">
                    <h2 className="text-xl font-bold">Scramble</h2>
                    {scramble && (
                        <div className="font-mono text-2xl p-4 bg-gray-100 rounded-lg shadow-inner">
                            {scramble.toString().split(" ").map((move, index) => (
                                <span key={index} className={index === scrambleIndex ? 'text-blue-500 font-bold' : index < scrambleIndex ? 'text-green-500' : ''}>
                                    {move}{' '}
                                </span>
                            ))}
                        </div>
                    )}
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    {!isConnected && <p className="text-red-500 mt-4">Connect your bluetooth cube to start.</p>}
                </div>

                <div className="w-1/2 flex flex-col space-y-4">
                    <div className="flex-grow border rounded-lg flex justify-center items-center bg-gray-50 dark:bg-gray-800">
                        {expectedCubeState && <CubeStateDisplay kpuzzle={kpuzzle} pattern={expectedCubeState.getPattern()} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimerScreen;

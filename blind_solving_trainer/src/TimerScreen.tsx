import React, { useEffect, useState, useRef } from 'react';
import { randomScrambleForEvent } from 'cubing/scramble';
import { Alg, Move } from 'cubing/alg';
import { useBluetooth } from './bluetooth/BluetoothContext';
import { CubeStateManager } from './lib/CubeStateManager';
import { KPattern, KPuzzle } from 'cubing/kpuzzle';
import { puzzles } from 'cubing/puzzles';
import { TwistyPlayer } from 'cubing/twisty';
import { W } from 'node_modules/cubing/dist/lib/cubing/PuzzleLoader-R-puDLmC';

if (!customElements.get('twisty-player')) {
    customElements.define('twisty-player', TwistyPlayer);
}

interface TimerScreenProps {
    backToMemoSetup: () => void;
}

function getMovesFromAlg(alg: Alg): Move[] {
    const moveStrings = alg.expand().toString().split(' ').filter(s => s.length > 0);
    return moveStrings.map(moveString => new Move(moveString));
}

const TimerScreen: React.FC<TimerScreenProps> = ({ backToMemoSetup }) => {
    const [scramble, setScramble] = useState<Alg | null>(null);
    // const [scrambleIndex, setScrambleIndex] = useState(0);
    const { cubeState: userCubeState, isConnected, reset } = useBluetooth();
    const [expectedCubeState, setExpectedCubeState] = useState<CubeStateManager | null>(null);
    const [kpuzzle, setKpuzzle] = useState<KPuzzle | null>(null);
    const [displayAlg, setDisplayAlg] = useState<Alg | null>(null);
    const [isErrorState, setIsErrorState] = useState(false);
    const [recoveryAlg, setRecoveryAlg] = useState<Alg | null>(null);

    const scrambleIndex = useRef(0);
    const incorrectMoves = useRef<Move[]>([]);

    const playerRef = useRef<any>(null);
    const userPlayerRef = useRef<any>(null);
    const prevUserCubeStateRef = useRef<CubeStateManager | null>(null);

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
            setDisplayAlg(newScramble);
            scrambleIndex.current = 0;
            incorrectMoves.current = [];
            setExpectedCubeState(new CubeStateManager(kpuzzle));
            reset();
        };

        generateScramble();
    }, [kpuzzle]);

    useEffect(() => {
        if (playerRef.current && kpuzzle && expectedCubeState) {
            playerRef.current.puzzle = kpuzzle;
            playerRef.current.experimentalSetup = {
                pattern: expectedCubeState.getPattern(),
            };
        }
    }, [expectedCubeState, kpuzzle]);

    useEffect(() => {
        if (userPlayerRef.current && kpuzzle && userCubeState) {
            userPlayerRef.current.puzzle = kpuzzle;
            userPlayerRef.current.alg = userCubeState.getMovesString();
        }
    }, [userCubeState, kpuzzle]);

    useEffect(() => {
        puzzles["3x3x3"].kpuzzle().then(kpuzzle => {
            setKpuzzle(kpuzzle);
            setExpectedCubeState(new CubeStateManager(kpuzzle));
        });
    }, []);

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
            if (userCubeState.getPattern().isIdentical(currentExpectedCubeState.getPattern())) { // switch back to regular state
                setIsErrorState(false);
                setDisplayAlg(scramble);
                incorrectMoves.current = [];
            } else { // dealing with error state
                const lastMove = userCubeState.getLastMove();

                if (lastMove.invert() == incorrectMoves.current[0]) { // if recovery move
                    incorrectMoves.current.shift();
                } else {
                    incorrectMoves.current.push(lastMove);
                }
                const undoAlg = new Alg(incorrectMoves.current).invert();
                console.log("undo alg:", undoAlg.toString());
                setDisplayAlg(undoAlg);
            }
            prevUserCubeStateRef.current = userCubeState;
            return;
        }

        const scrambleMoves = getMovesFromAlg(scramble);
        if (currentScrambleIndex.current >= scrambleMoves.length) return; // Scramble complete

        const expectedMove = scrambleMoves[currentScrambleIndex.current];
        console.log("expected move:", expectedMove.toString());
        const finalExpectedState = currentExpectedCubeState.applyMove(expectedMove.toString());

        // 2. Check for move completion
        if (userCubeState.getPattern().isIdentical(finalExpectedState.getPattern())) {
            setExpectedCubeState(finalExpectedState);
            currentScrambleIndex.current++;
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
                return;
            }
        }

        // 4. If we're here, it's a genuine error
        if (scrambleIndex.current > 0) {
            setIsErrorState(true);
            // const wrongMoves = userCubeState.getMoves().slice(userCubeState.getMoves().length - ++incorrectMoveCount.current).join(' ');
            console.log("last move when wrong", userCubeState.getLastMove());
            incorrectMoves.current.push(userCubeState.getLastMove());
            console.log("incorrectMoves", incorrectMoves.toString());
            const undoAlg = new Alg(incorrectMoves.current).invert();
            setDisplayAlg(undoAlg.experimentalSimplify());
            prevUserCubeStateRef.current = userCubeState;
        }
    }, [userCubeState, scramble]);


    return (
        <div className="flex flex-col h-full w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <button onClick={backToMemoSetup} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back to Menu
                </button>
            </div>
            <div className="flex-grow flex justify-center items-center">
                <div className="w-full flex flex-col space-y-4 items-center">
                    {displayAlg && (
                        <div className="font-mono text-2xl p-4 bg-gray-200 rounded-lg shadow-inner">
                            {displayAlg.toString().split(" ").map((move, index) => (
                                <span key={index} className={isErrorState ? 'text-red-500' : (index === scrambleIndex.current ? 'text-blue-500 font-bold' : index < scrambleIndex.current ? 'text-green-500' : '')}>
                                    {move}{' '}
                                </span>
                            ))}
                        </div>
                    )}
                    {!isConnected && <p className="text-red-500 mt-4">Connect your bluetooth cube to start.</p>}
                    {isErrorState && <p className="text-red-500 mt-4">In error state.</p>}
                </div>

            </div>
            <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', zIndex: 10 }}>
                <twisty-player
                    puzzle="3x3x3"
                    alg={userCubeState?.getMovesString()}
                    background="none"
                    control-panel="none"
                    camera-distance="6"
                    className="w-full h-full"
                ></twisty-player>
            </div>
        </div>
    );
};

export default TimerScreen;

import { Alg, Move } from "cubing/alg";
import { KPattern, KPuzzle } from "cubing/kpuzzle";
import { randomScrambleForEvent } from "cubing/scramble";
import { getConsiseMovesFromAlg, getExpandedMovesFromAlg } from "./cubingUtils";
import { assert } from "console";

interface ScrambleMachineState {
  status: ScrambleState;
  userCubeState: KPattern;
  nextCubeState: KPattern; // the state of the cube after applying the next move (after corrective steps if in "correction" state)
  targetCubeState: KPattern;
  scramble: Alg;
  scrambleMoveIndex: number;
  currentMoveStatus?: MoveStatus;
  correction?: Alg;
}

type MoveStatus = "next" | "partial"; // "next" if move has not been done yet, "partial" if part of the move has been done

type ScrambleState = "scrambling" | "correction" | "scramble_complete";

type ScrambleEvent =
  | { type: "GENERATE_SCRAMBLE" }
  | { type: "BLUETOOTH_MOVE"; move: Move }
  | { type: "RESET" };

export class ScrambleMachine {
  private kpuzzle: KPuzzle;
  private state: ScrambleMachineState;

  constructor(userCubePattern: KPattern) {
    this.kpuzzle = userCubePattern.kpuzzle;
    this.state = {
      status: "scramble_complete",
      userCubeState: userCubePattern,
      nextCubeState: userCubePattern,
      targetCubeState: userCubePattern,
      scramble: new Alg(),
      scrambleMoveIndex: 0,
    };
  }

  getState() {
    return this.state;
  }

  async dispatch(event: ScrambleEvent) {
    switch (event.type) {
      case "GENERATE_SCRAMBLE":
        const scramble = await randomScrambleForEvent("333");
        this.state = {
          ...this.state,
          status: "scrambling",
          scramble: scramble,
          targetCubeState: this.state.userCubeState.applyAlg(scramble),
          nextCubeState: this.state.userCubeState.applyMove(getExpandedMovesFromAlg(scramble)[0]),
        };
        break;

      case "BLUETOOTH_MOVE":
        this.handleMove(event.move);
        break;

      case "RESET":
        this.state = {
          ...this.state,
          status: "scramble_complete",
          userCubeState: this.kpuzzle.defaultPattern(),
        };
        break;
    }
  }

  private handleMove(move: Move) {
    const newUserCubeState = this.state.userCubeState.applyMove(move);

    this.state = {
      ...this.state,
      userCubeState: newUserCubeState,
    };

    if (this.state.status = "correction") {
      // check if move is the correction move
      if (!this.state.correction) {
        return;
      }
      const correctionMoves = getExpandedMovesFromAlg(this.state.correction);
      if (move != correctionMoves[0]) {
        this.state.correction = new Alg(correctionMoves.unshift(move.invert()));
      } else {

      }
    }

    if (newUserCubeState == this.state.targetCubeState) {
      this.state.status = "scramble_complete";
      return;
    }
    // check if the move is in the family of the next move in the scramble
    const nextMoveInScramble = getConsiseMovesFromAlg(this.state.scramble)[0];
    if (nextMoveInScramble.family != move.family) {
      this.state.status = "correction";
      this.state.correction = new Alg(move.invert().toString());
    } else if (newUserCubeState != this.state.nextCubeState) { // same family, but have not achieved the right state
      this.state.currentMoveStatus = "partial";
    } else { // the move achieved the right next state
      this.state.scrambleMoveIndex++;
      this.state.currentMoveStatus = "next";
    }
  }
}

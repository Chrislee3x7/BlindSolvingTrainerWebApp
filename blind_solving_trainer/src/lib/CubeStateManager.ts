import { Move } from 'cubing/alg';
import { KPattern, KPuzzle } from 'cubing/kpuzzle';

export class CubeStateManager {
    private kpuzzle: KPuzzle;
    private pattern: KPattern;
    private moves: string[] = [];

    constructor(kpuzzle: KPuzzle) {
        this.kpuzzle = kpuzzle;
        this.pattern = this.kpuzzle.defaultPattern();
    }

    public applyMove(move: string): CubeStateManager {
        const newPattern = this.pattern.applyAlg(move);
        const newCubeState = new CubeStateManager(this.kpuzzle);
        newCubeState.setPattern(newPattern);

        // @ts-ignore
        if (newPattern.experimentalIsSolved({ ignoreCenterOrientation: true, ignorePuzzleOrientation: true })) {
            newCubeState.moves = [];
        } else {
            newCubeState.moves = [...this.moves, move];
        }

        return newCubeState;
    }

    public getPattern(): KPattern {
        return this.pattern;
    }

    public setPattern(pattern: KPattern): void {
        this.pattern = pattern;
    }

    public getMoves(): string[] {
        return this.moves;
    }

    public getMovesString(): string {
        return this.moves.join(" ");
    }

    public getMoveCount(): number {
        return this.moves.length;
    }

    public getLastMove(): Move {
        return new Move(this.moves.length > 0 ? this.moves[this.moves.length - 1] : '');
    }

    public reset(): void {
        this.pattern = this.kpuzzle.defaultPattern();
        this.moves = [];
    }
}

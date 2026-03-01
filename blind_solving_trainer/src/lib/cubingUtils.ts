import { Alg, Move } from "cubing/alg";

export function getExpandedMovesFromAlg(alg: Alg): Move[] {
  const moveStrings = alg.expand().toString().split(' ').filter(s => s.length > 0);
  return moveStrings.map(moveString => new Move(moveString));
}

export function getConsiseMovesFromAlg(alg: Alg): Move[] {
  const moveStrings = alg.toString().split(' ').filter(s => s.length > 0);
  return moveStrings.map(moveString => new Move(moveString));
}
import { Face, MemoSchemeType, MemoSchemeUtils } from "./MemoScheme";

export type Sticker = { // has color
  face: Face;
  color: string;
  memo: string;
}

export type CornerPiece = [Sticker, Sticker, Sticker];

export type EdgePiece = [Sticker, Sticker];

/**
 * Representation of a cube which can be created from a memoscheme type
 * We will sample pieces from here to train with
 */
export class Cube {

  private cornerPieces: CornerPiece[]
  private edgePieces: EdgePiece[]

  constructor(memoScheme: MemoSchemeType) {
    // assume memoScheme is valid
    if (!MemoSchemeUtils.isValidMemoScheme(memoScheme)) {
      throw Error("Cube.ts - constructor() - Attempting to construct a cube from invalid memo scheme.");
    }

    console.log("Cube created with memoscheme:", memoScheme);

    // break up the memoScheme into pieces
    /**
     * Corners: (U[0], L[0], B[1]), (U[1], B[0], R[1]), (U[2], R[0], F[1]), (U[3], F[0], L[1]), top (clockwise from top sticker)
     *          (D[0], L[2], F[3]), (D[1], F[2], R[3]), (D[2], R[2], B[3]), (D[3], B[2], L[3]), bot (clockwise from bot sticker)
     * 
     * Edges:   (U[0], B[0]), (U[1], R[0]), (U[2], F[0]), (U[3], L[0]), top
     *          (L[1], F[3]), (F[1], R[3]), (R[1], B[3]), (B[1], L[3]), middle layer
     *          (D[0], F[2]), (D[1], R[2]), (D[2], B[2]), (D[3], L[2])
     */
    this.cornerPieces = [];

    this.cornerPieces.push(this.constructCorner(memoScheme, Face.U, 0, Face.L, 0, Face.B, 1))
    this.cornerPieces.push(this.constructCorner(memoScheme, Face.U, 1, Face.B, 0, Face.R, 1))
    this.cornerPieces.push(this.constructCorner(memoScheme, Face.U, 2, Face.R, 0, Face.F, 1))
    this.cornerPieces.push(this.constructCorner(memoScheme, Face.U, 3, Face.F, 0, Face.L, 1))
    this.cornerPieces.push(this.constructCorner(memoScheme, Face.D, 0, Face.L, 2, Face.F, 3))
    this.cornerPieces.push(this.constructCorner(memoScheme, Face.D, 1, Face.F, 2, Face.R, 3))
    this.cornerPieces.push(this.constructCorner(memoScheme, Face.D, 2, Face.R, 2, Face.B, 3))
    this.cornerPieces.push(this.constructCorner(memoScheme, Face.D, 3, Face.B, 2, Face.L, 3))

    this.edgePieces = [];

    this.edgePieces.push(this.constructEdge(memoScheme, Face.U, 0, Face.B, 0))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.U, 1, Face.R, 0))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.U, 2, Face.F, 0))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.U, 3, Face.L, 0))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.L, 1, Face.F, 3))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.F, 1, Face.R, 3))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.R, 1, Face.B, 3))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.B, 1, Face.L, 3))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.D, 0, Face.F, 2))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.D, 1, Face.R, 2))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.D, 2, Face.B, 2))
    this.edgePieces.push(this.constructEdge(memoScheme, Face.D, 3, Face.L, 2))
  }

  private constructCorner(memoScheme: MemoSchemeType, f1: Face, i1: number, f2: Face, i2: number, f3: Face, i3: number): CornerPiece {
    let s1: Sticker = { color: memoScheme[f1].color, face: f1, memo: memoScheme[f1].corners[i1] }
    let s2: Sticker = { color: memoScheme[f2].color, face: f2, memo: memoScheme[f2].corners[i2] }
    let s3: Sticker = { color: memoScheme[f3].color, face: f3, memo: memoScheme[f3].corners[i3] }
    return [s1, s2, s3];
  }

  private constructEdge(memoScheme: MemoSchemeType, f1: Face, i1: number, f2: Face, i2: number): EdgePiece {
    let s1: Sticker = { color: memoScheme[f1].color, face: f1, memo: memoScheme[f1].corners[i1] }
    let s2: Sticker = { color: memoScheme[f2].color, face: f2, memo: memoScheme[f2].corners[i2] }
    return [s1, s2];
  }

  public sampleEdgePiece() {
    let randIdx = Math.floor(Math.random() * this.edgePieces.length)
    return this.edgePieces[randIdx];
  }

  public sampleCornerPiece() {
    let randIdx = Math.floor(Math.random() * this.cornerPieces.length)
    return this.cornerPieces[randIdx];
  }

}


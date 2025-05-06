export enum Face {
  U = "U",
  L = "L",
  F = "F",
  R = "R",
  B = "B",
  D = "D"
}

export enum PieceType {
  CORNER = "Corner",
  EDGE = "Edge",
  CENTER = "Center"
}

export type StickerId = {
  face: Face;
  type: PieceType;
  idx: 0 | 1 | 2 | 3
}

export type FaceMemoData = {
  color: string; // HEX color, e.g. "#FFFFFF"
  corners: [string, string, string, string];
  edges: [string, string, string, string];
  cornersValid: [boolean, boolean, boolean, boolean]
  edgesValid: [boolean, boolean, boolean, boolean]
}

export type MemoSchemeType = Record<Face, FaceMemoData>

export namespace MemoSchemeUtils {
  export const createDefault = (): MemoSchemeType => {
    return {
      U: {
        color: "#FFFFFF",
        corners: ["A", "B", "C", "D"],
        edges: ["A", "B", "C", "D"],
        cornersValid: [true, true, true, true],
        edgesValid: [true, true, true, true],
      },
      L: {
        color: "#FF8708",
        corners: ["E", "F", "G", "H"],
        edges: ["E", "F", "G", "H"],
        cornersValid: [true, true, true, true],
        edgesValid: [true, true, true, true],
      },
      F: {
        color: "#09CF02",
        corners: ["I", "J", "K", "L"],
        edges: ["I", "J", "K", "L"],
        cornersValid: [true, true, true, true],
        edgesValid: [true, true, true, true],
      },
      R: {
        color: "#EB2902",
        corners: ["M", "N", "O", "P"],
        edges: ["M", "N", "O", "P"],
        cornersValid: [true, true, true, true],
        edgesValid: [true, true, true, true],
      },
      B: {
        color: "#0877FF",
        corners: ["Q", "R", "S", "T"],
        edges: ["Q", "R", "S", "T"],
        cornersValid: [true, true, true, true],
        edgesValid: [true, true, true, true],
      },
      D: {
        color: "#FFFF00",
        corners: ["U", "V", "W", "X"],
        edges: ["U", "V", "W", "X"],
        cornersValid: [true, true, true, true],
        edgesValid: [true, true, true, true],
      }
    }
  }

  export const updateMemoScheme = (memoScheme: MemoSchemeType, stickerId: StickerId, newMemo: string): MemoSchemeType => {
    const updatedMemoScheme: MemoSchemeType = JSON.parse(JSON.stringify(memoScheme));
    console.log(stickerId.type)

    if (stickerId.type == PieceType.CORNER) {
      console.log("in corner")
      updatedMemoScheme[stickerId.face].corners[stickerId.idx] = newMemo;
    } else if (stickerId.type == PieceType.EDGE) {
      console.log("in edge")
      updatedMemoScheme[stickerId.face].edges[stickerId.idx] = newMemo;
    } else {
      throw Error("MemoScheme - updateMemoScheme() - unable to set memo for center sticker type");
    }

    console.log(updatedMemoScheme)

    return updatedMemoScheme;
  }

  /**
   * Only valid memos are alphanumeric single character strings
   * @param memo The string to compare if it can be used as a memo
   * @returns true if memo is valid
   */
  export const isValidMemo = (memo: string): boolean => {
    return /^[a-zA-Z0-9]$/.test(memo);
  }

  export const isValidMemoScheme = (memoScheme: MemoSchemeType): boolean => {
    let faces: Face[] = Object.keys(memoScheme) as Face[];
    for (let f of faces) {
      let fmd: FaceMemoData = memoScheme[f];
      for (let i = 0; i < 4; i++) {
        if (!fmd.cornersValid[i] || !fmd.edgesValid[i]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check memo scheme for validity and returns "validated" memoscheme
   * @param memoScheme the memo scheme to check
   * @returns MemoScheme where each duplicated memo is a string with "!"" in front
   * ex: "!M" if there are two Ms on two corners
  */
  export const validateMemoScheme = (memoScheme: MemoSchemeType): MemoSchemeType => {
    let faces: Face[] = Object.keys(memoScheme) as Face[];
    let nUniqueKeys: number = (new Set(faces)).size;
    if (faces.length != 6 || nUniqueKeys != 6) {
      throw Error("MemoScheme.ts - validateMemoScheme() - Invalid number of faces: " + faces);
    }

    // now that we know we have the right type, create sets to start checking for invalid faces
    let corners: Set<string> = new Set<string>();
    let edges: Set<string> = new Set<string>();

    let invalidCorners: Set<string> = new Set<string>();
    let invalidEdges: Set<string> = new Set<string>();

    // loop through all faces 
    for (let f of faces) {
      let fmd: FaceMemoData = memoScheme[f];
      // check corners
      for (let c of fmd.corners) {
        if (corners.has(c)) {
          invalidCorners.add(c);
        } else {
          corners.add(c);
        }
      }
      for (let e of fmd.edges) {
        if (edges.has(e)) {
          invalidEdges.add(e);
        } else {
          edges.add(e);
        }
      }
    }

    // deep copy a new memoScheme
    let markedMemoScheme: MemoSchemeType = JSON.parse(JSON.stringify(memoScheme));

    // reconstruct a memoScheme with validCorners/Edges
    // reuse faces
    for (let f of faces) {
      let fmd: FaceMemoData = markedMemoScheme[f];
      // loop through corners
      for (let i = 0; i < 4; i++) {
        let c: string = fmd.corners[i]
        markedMemoScheme[f].cornersValid[i] = !invalidCorners.has(c) && isValidMemo(c)
      }
      // do same thing with edges
      for (let i = 0; i < 4; i++) {
        let e: string = fmd.edges[i]
        markedMemoScheme[f].edgesValid[i] = !invalidEdges.has(e) && isValidMemo(e)

      }
    }

    return markedMemoScheme;
  }
}
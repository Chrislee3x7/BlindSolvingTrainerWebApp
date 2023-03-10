class Cube {

    static defaultColorScheme =
            ["#FFFFFF", // white
            "#FF8708", // orange
            "#09CF02", // green
            "#EB2902", // red
            "#0877FF", // blue
            "#FFFF00"]; // yellow

    static defaultMemoScheme = 
        "A0A0B0B0C0C0D0D0" +
        "E0E0F0F0G0G0H0H0" +
        "I0I0J0J0K0K0L0L0" +
        "M0M0N0N0O0O0P0P0" +
        "Q0Q0R0R0S0S0T0T0" +
        "U0U0V0V0W0W0X0X0";

    static defaultMemos = [
        ['A', 'B', 'C', 'D'],
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P'],
        ['Q', 'R', 'S', 'T'],
        ['U', 'V', 'W', 'X']
    ];

    #cubeFaces;
    #allPieces;
    #cornerPieces;
    #edgePieces;

    constructor() {
        this.#cubeFaces = new Array(6); // holds the 6 faces of the cube in order: U,L,F,R,B,D
        this.#allPieces = new Set();
        this.#cornerPieces = new Map();
        this.#edgePieces = new Map();

        for (let i = 0; i < 6; i++) {
            this.#cubeFaces[i] = new CubeFace(Cube.defaultColorScheme[i]);
        }
        this.#loadMemoScheme();
        //this.#setPieces();
    }

    loadDefaultMemoScheme() {
        localStorage.setItem("memoScheme", Cube.defaultMemoScheme);
        this.#loadMemoScheme();
    }

    #loadMemoScheme() {
        let memoScheme = localStorage.getItem("memoScheme");
        if (memoScheme == null) { // if no such key exists...
            // set it in local storage
            localStorage.setItem("memoScheme", Cube.defaultMemoScheme);
            // load in default memo scheme
            memoScheme = localStorage.getItem("memoScheme");
        }
        for (let i = 0; i < memoScheme.length / 16; i++) {
            for (let j = 0; j < 4; j++) {
                let currCubeFace = this.#cubeFaces[Math.floor(i)]; // get the correct cube face
                
                let cornerStickerJ = currCubeFace.getCornerStickerI(j);
                cornerStickerJ.memoChar = memoScheme.charAt((i * 16) + (j * 4));
                if (memoScheme.charAt((i * 16) + (j * 4) + 1) == 1) {
                    cornerStickerJ.conflicted = true;
                }
                let edgeStickerJ = currCubeFace.getEdgeStickerI(j);
                edgeStickerJ.memoChar = memoScheme.charAt((i * 16) + (j * 4) + 2);
                if (memoScheme.charAt((i * 16) + (j * 4) + 3) == 1) {
                    edgeStickerJ.conflicted = true;
                }
            }
        }
    }

    saveMemoScheme() {
        let memoSchemeEncoding = [];
        for (let i = 0; i < this.#cubeFaces.length; i++) {
            let currFace = this.#cubeFaces[i];
            let cornerStickerList = currFace.cornerStickers;
            let edgeStickerList = currFace.edgeStickers;
            for (let j = 0; j < cornerStickerList.length; j++) {
                memoSchemeEncoding.push(cornerStickerList[j].memoChar);
                if (cornerStickerList[j].conflicted) {
                    memoSchemeEncoding.push("1");
                } else {
                    memoSchemeEncoding.push("0");
                }
                memoSchemeEncoding.push(edgeStickerList[j].memoChar);
                if (edgeStickerList[j].conflicted) {
                    memoSchemeEncoding.push("1");
                } else {
                    memoSchemeEncoding.push("0");
                }
            }
        }
        localStorage.setItem("memoScheme", memoSchemeEncoding.join(""));
    }

    // Hardcoded values from cubeFaces. should not be changed
    #setPieces() {
        // add cornerPieces
        this.#cornerPieces.set(0, getCornerPieceHelper(0,0,1,0,4,1));
        this.#cornerPieces.set(1, getCornerPieceHelper(0,1,4,0,3,1));
        this.#cornerPieces.set(2, getCornerPieceHelper(0,2,3,0,2,1));
        this.#cornerPieces.set(3, getCornerPieceHelper(0,3,2,0,1,1));
        this.#cornerPieces.set(4, getCornerPieceHelper(5,0,1,2,2,3));
        this.#cornerPieces.set(5, getCornerPieceHelper(5,1,2,2,3,3));
        this.#cornerPieces.set(6, getCornerPieceHelper(5,2,3,2,4,3));
        this.#cornerPieces.set(7, getCornerPieceHelper(5,3,4,2,1,3));

        // add edgePieces
        this.#edgePieces.set(0, getEdgePieceHelper(0,0,4,0));
        this.#edgePieces.set(1, getEdgePieceHelper(0,1,3,0));
        this.#edgePieces.set(2, getEdgePieceHelper(0,2,2,0));
        this.#edgePieces.set(3, getEdgePieceHelper(0,3,1,0));
        this.#edgePieces.set(4, getEdgePieceHelper(1,1,2,3));
        this.#edgePieces.set(5, getEdgePieceHelper(2,1,3,3));
        this.#edgePieces.set(6, getEdgePieceHelper(3,1,4,3));
        this.#edgePieces.set(7, getEdgePieceHelper(1,3,4,1));
        this.#edgePieces.set(8, getEdgePieceHelper(5,0,2,2));
        this.#edgePieces.set(9, getEdgePieceHelper(5,1,3,2));
        this.#edgePieces.set(10, getEdgePieceHelper(5,2,4,2));
        this.#edgePieces.set(11, getEdgePieceHelper(5,3,1,2));

        // add corner and edge pieces to all pieces
        allPieces.addAll(this.#cornerPieces.values());
        allPieces.addAll(this.#edgePieces.values());
    }

    getStickerConflicts(sourceSticker) {
        let conflictsList = [];
        let stickerType = sourceSticker.pieceType;
        let conflictMemo = sourceSticker.memoChar;
        if (stickerType == PieceType.Corner) {
            console.log("finding conflicts called");
            this.#cubeFaces.forEach(face => {
                face.cornerStickers.forEach(s => {
                    if (s.memoChar == conflictMemo) {
                        conflictsList.push(s);
                    }
                });
            });
        } else if (stickerType == PieceType.Edge) {
            this.#cubeFaces.forEach(face => {
                face.edgeStickers.forEach(s => {
                    if (s.memoChar == conflictMemo) {
                        conflictsList.push(s);
                    }
                });
            });
        }
        return conflictsList;
    }

    get cubeFaces() {
        return this.#cubeFaces;
    }
}
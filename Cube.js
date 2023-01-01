class Cube {

    defaultColorScheme =
            ["#FFFFFF", // white
            "#FF8708", // orange
            "#09CF02", // green
            "#EB2902", // red
            "#0877FF", // blue
            "#FFFF00"]; // yellow

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
            this.#cubeFaces[i] = new CubeFace(this.defaultColorScheme[i]);
        }
        //loadMemoScheme();
        //this.#setPieces();
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

    get cubeFaces() {
        return this.#cubeFaces;
    }
}
class Cube {

    static defaultColorScheme =
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
        this.cubeFaces = []; // holds the 6 faces of the cube in order: U,L,F,R,B,D
        this.allPieces = new Set();
        this.cornerPieces = new Map();
        this.edgePieces = new Map();

        cubeFaces = new CubeFace[6];
        for (let i = 0; i < 6; i++) {
            cubeFaces[i] = new CubeFace(defaultColorScheme[i]);
        }
    }
}
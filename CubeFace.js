class CubeFace {

    constructor(faceColor) {
        this.color = faceColor;
        
        // intialize corner sticker and edge sticker array
        // corner stickers
        // | 0 - 1 |
        // | - - - |
        // | 3 - 2 |
        this.cornerStickers = [];
        // edge stickers
        // | - 0 - |
        // | 3 - 1 |
        // | - 2 - |
        this.edgeStickers = [];
        // all stickers
        // | 0 1 2 |
        // | 3 4 5 |
        // | 6 7 8 |
        this.allStickers = [];

        for (let i = 0; i < 4; i++) {
            this.cornerStickers[i] = new Sticker(color, '-', PieceType.Corner);
            this.edgeStickers[i] = new Sticker(color, '-', PieceType.Edge);
        }
        updateAllStickersArray();
    }

    updateAllStickersArray() {
        allStickers = new Sticker[this.cornerStickers[0], this.edgeStickers[0], this.cornerStickers[1], this.edgeStickers[3],
            new Sticker(this.color, '-', PieceType.CENTER), this.edgeStickers[1], this.cornerStickers[3], this.edgeStickers[2], this.cornerStickers[2]];
    }
    
    get cornerStickers() {
        return this.cornerStickers;
    }

    get edgeStickers() {
        return this.edgeStickers;
    }

    
}
class CubeFace extends Rectangle {

    #color;
    #cornerStickers;
    #edgeStickers;
    #allStickers;

    constructor(faceColor) {
        super();
        this.#color = faceColor;
        
        // intialize corner sticker and edge sticker array
        // corner stickers
        // | 0 - 1 |
        // | - - - |
        // | 3 - 2 |
        this.#cornerStickers = new Array(4);
        // edge stickers
        // | - 0 - |
        // | 3 - 1 |
        // | - 2 - |
        this.#edgeStickers = new Array(4);
        // all stickers
        // | 0 1 2 |
        // | 3 4 5 |
        // | 6 7 8 |
        this.#allStickers = new Array(9);

        for (let i = 0; i < 4; i++) {
            this.#cornerStickers[i] = new Sticker(this.#color, '-', PieceType.Corner);
            this.#edgeStickers[i] = new Sticker(this.#color, '-', PieceType.Edge);
        }
        this.updateAllStickersArray();
    }

    updateAllStickersArray() {
        this.#allStickers = [this.#cornerStickers[0], this.#edgeStickers[0], this.#cornerStickers[1], this.#edgeStickers[3],
            new Sticker(this.#color, '-', PieceType.CENTER), this.#edgeStickers[1], this.#cornerStickers[3], this.#edgeStickers[2], this.#cornerStickers[2]];
    }

    findStickerAtCoords(x, y) {
        // search through all stickers
        for (let i = 0; i < 9; i++) {
            let sticker = this.#allStickers[i];
            if (sticker.contains(x, y)) {
                return sticker;
            }
        }
        return null;
    }

    getStickerI(i) {
        return this.#allStickers[i];
    }

    getCornerStickerI(i) {
        return this.#cornerStickers[i];
    }

    getEdgeStickerI(i) {
        return this.#edgeStickers[i];
    }
    
    get cornerStickers() {
        return this.#cornerStickers;
    }

    get edgeStickers() {
        return this.#edgeStickers;
    }

    get color() {
        return this.#color;
    }


}
class Sticker {

    static blinkColor = rgb(126, 238, 234);

    constructor(color, memoChar, pieceType) {
        this.color = color;
        this.pieceType = pieceType;
        // default should not be in edit mode
        this.editModeOn = false;
    }
}
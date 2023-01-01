class Sticker extends Rectangle {

    static blinkColor = "#7EEEEA";

    #color;
    #memoChar;
    #pieceType;
    #editModeOn;

    constructor(color, memoChar, pieceType) {
        this.color = color;
        this.memoChar = memoChar;
        this.pieceType = pieceType;
        // default should not be in edit mode
        this.editModeOn = false;
    }

    get color() {
        return this.#color;
    }
}
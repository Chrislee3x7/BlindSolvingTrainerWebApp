class Sticker extends Rectangle {

    static blinkColor = "#7EEEEA";

    #color;
    #memoChar;
    #pieceType;
    #editModeOn;
    #conflicted;

    #displayColor; // same as this.color by default, but changes when edit mode is on 

    constructor(color, memoChar, pieceType) {
        super();
        this.#color = color;
        this.#memoChar = memoChar;
        this.#pieceType = pieceType;
        // default should not be in edit mode
        this.#editModeOn = false;
        this.#conflicted = false;
        this.displayColor = color;
    }

    get color() {
        return this.#color;
    }

    get displayColor() {
        return this.#displayColor;
    }

    get pieceType() {
        return this.#pieceType;
    }

    get memoChar() {
        return this.#memoChar;
    }

    get conflicted() {
        return this.#conflicted;
    }

    set displayColor(color) {
        this.#displayColor = color;
    }

    set memoChar(c) {
        this.#memoChar = c;
    }

    set conflicted(b) {
        this.#conflicted = b;
    }

    set editModeOn(b) {
        this.#editModeOn = b;
    }
}
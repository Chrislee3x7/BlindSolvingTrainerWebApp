class Sticker extends Rectangle {

    static blinkColor = "#7EEEEA";

    #color;
    #memoChar;
    #pieceType;
    #editModeOn;
    #conflicted;

    constructor(color, memoChar, pieceType) {
        super();
        this.#color = color;
        this.#memoChar = memoChar;
        this.#pieceType = pieceType;
        // default should not be in edit mode
        this.#editModeOn = false;
        this.#conflicted = false;
    }

    get color() {
        return this.#color;
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

    set memoChar(c) {
        this.#memoChar = c;
    }

    set conflicted(b) {
        this.#conflicted = b;
    }
}
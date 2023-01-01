class Rectangle {
    x;
    y;
    width;
    height;

    // constructor() {
    //     this.x = 0;
    //     this.y = 0;
    //     this.width = 0;
    //     this.height = 0;
    // }

    // width and height should be positive
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(x, y) {
        return (x >= this.x && x <= this.x + this.width) && (y >= this.y && y <= this.y + this.width);
    }

    setBounds(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
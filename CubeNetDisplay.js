class CubeNetDisplay {

    #faceWidth;
    #stickerWidth;
    #stickerBorderWidth;
    
    cube;
    canvas;

    constructor(cube) {
        this.cube = cube;
        this.canvas = document.getElementById("cube-net-display");
    }

    updatePanelDimension() {
        this.#faceWidth = this.canvas.width / 14;
        if (this.canvas.height / 4 < this.#faceWidth) {
            this.#faceWidth = this.canvas.height / 4;
        }
        this.#stickerWidth = this.#faceWidth / 3;
        this.#stickerBorderWidth = this.#faceWidth / 30;
        this.#faceWidth = (3 * this.#stickerWidth + 3 * this.#stickerBorderWidth);
    }

    paintCubeNet() {
        // Below is to make sure canvas scales correctly to make non-blurry lines
        let context = this.canvas.getContext("2d");
        
        const sWidth = 1000;
        const sHeight = 500;
    
        this.canvas.style.width = sWidth + "px";
        this.canvas.style.height = sHeight + "px";
    
        let scale = window.devicePixelRatio;
        this.canvas.width = sWidth * scale;
        this.canvas.height = sHeight * scale;
    
        context.scale(scale, scale);
        // canvas set up ends here

        this.updatePanelDimension();
    
        let centerFaceTopLeftCornerX = (this.canvas.width / (2 * scale)) - (this.#faceWidth * 2);
        let centerFaceTopLeftCornerY = (this.canvas.height / (2 * scale)) - (this.#faceWidth / 2);
        
        this.paintCubeFace(context, centerFaceTopLeftCornerX + this.#faceWidth, centerFaceTopLeftCornerY - this.#faceWidth, 0);
        this.paintCubeFace(context, centerFaceTopLeftCornerX, centerFaceTopLeftCornerY, 1);
        this.paintCubeFace(context, centerFaceTopLeftCornerX + this.#faceWidth, centerFaceTopLeftCornerY, 2);
        this.paintCubeFace(context, centerFaceTopLeftCornerX + (2 * this.#faceWidth), centerFaceTopLeftCornerY, 3);
        this.paintCubeFace(context, centerFaceTopLeftCornerX + (3 * this.#faceWidth), centerFaceTopLeftCornerY, 4);
        this.paintCubeFace(context, centerFaceTopLeftCornerX + this.#faceWidth, centerFaceTopLeftCornerY + this.#faceWidth, 5);
    }
    
    paintCubeFace(context, faceStartX, faceStartY, faceIndex) {
        let cubeFace = this.cube.cubeFaces[faceIndex];
        //context.fillStyle = cubeFace.color;
        context.fillStyle = "#000000";
        cubeFace.setBounds(faceStartX, faceStartY,
            this.#faceWidth + this.#stickerBorderWidth,
            this.#faceWidth + this.#stickerBorderWidth);
        
        context.fillRect(cubeFace.x, cubeFace.y, cubeFace.width, cubeFace.height);
        for(let i = 0; i < 9; i++) {
            let sticker = cubeFace.getStickerI(i);
            let stickerStartX = faceStartX + ((i % 3) * Math.floor(this.#faceWidth / 3.0));
            let stickerStartY = faceStartY + (Math.floor(i / 3) * Math.floor(this.#faceWidth / 3.0));
            this.paintSticker(context, stickerStartX, stickerStartY, sticker);
        }
    }

    paintSticker (context, stickerStartX, stickerStartY, sticker) {
        context.fillStyle = sticker.color;
        
        sticker.setBounds(stickerStartX + this.#stickerBorderWidth, stickerStartY + this.#stickerBorderWidth,
                (this.#faceWidth - (3 * this.#stickerBorderWidth)) / 3,
                (this.#faceWidth  - (3 * this.#stickerBorderWidth)) / 3);
        context.fillRect(sticker.x, sticker.y, sticker.width, sticker.height);
        //paintMemo(g, sticker);
    }
}
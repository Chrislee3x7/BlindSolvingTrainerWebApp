class CubeNetDisplay {

    #faceWidth;
    #stickerWidth;
    #stickerBorderWidth;
    #memoEditMode;
    #windowScale;

    cube;
    canvas;

    // mouse stuff:
    #pressedSticker;
    #editingSticker;
    #editingMemo;

    #editStickerDisplayTimer;

    constructor(cube) {
        this.cube = cube;
        this.#memoEditMode = PieceType.Corner;

        this.canvas = document.getElementById("cube-net-display");
        this.canvas.onmousedown = (event) => {
            let canvasRect = this.canvas.getBoundingClientRect();
            let x = event.clientX - canvasRect.left;
            let y = event.clientY - canvasRect.top;
            
            // return false in .every to "break"
            cube.cubeFaces.forEach((face => {
                if (!face.contains(x, y)) {
                    // if click location is not within this face, skip the logic for this face
                    return;
                }
                // otherwise get the sticker for this click loc
                this.#pressedSticker = face.findStickerAtCoords(x, y);
                //console.log(this.#pressedSticker.memoChar);
                // break:
                return false;
            }).bind(this));
        };

        this.canvas.onmouseup = (event) => {
            // no matter what, if there was a selected sticker before this click, it should no longer be selected
            if (this.#editingSticker != null) {
                this.turnOffEditMode(this.#editingSticker);
                return;
            }

            let canvasRect = this.canvas.getBoundingClientRect();
            let x = event.clientX - canvasRect.left;
            let y = event.clientY - canvasRect.top;

            let releasedSticker;
            cube.cubeFaces.forEach((face => {
                if (!face.contains(x, y)) {
                    return;
                }
                releasedSticker = face.findStickerAtCoords(x, y);
                if (this.#editingSticker == null && releasedSticker != null && releasedSticker == this.#pressedSticker && this.#pressedSticker.pieceType == this.#memoEditMode) {
                    // if clickedSticker is not null and the stickerType matches the memoEditMode
                    this.#editingSticker = releasedSticker;
                    this.#pressedSticker = null;
                    // will turn on edit mode for the current editingSticker
                    this.turnOnEditMode();
                }
            }).bind(this));
        }
    }

    turnOffEditMode() {
        // change to sticker to turn itself off???
        if (this.#editingSticker == null) {
            return;
        }
        clearInterval(this.#editStickerDisplayTimer);
        this.#editingSticker.editingMemo = false;
        this.#editingSticker.displayColor = this.#editingSticker.color;

        this.paintCubeNet();
        this.#editingMemo = false;
        this.#editingSticker = null;
    }

    turnOnEditMode() {
        if (this.#editingSticker == null) {
            return;
        }
        this.#editingMemo = true;
        this.#editingSticker.editingMemo = true;

        this.#editStickerDisplayTimer = setInterval(this.toggleEditingIndicator.bind(this), 500);
    }

    toggleEditingIndicator() {
        if (this.#editingSticker.displayColor == this.#editingSticker.color) {
            this.#editingSticker.displayColor = Sticker.blinkColor;
        }
        else {
            this.#editingSticker.displayColor = this.#editingSticker.color;
        }
        this.paintCubeNet();
    }

    updatePanelDimension() {
        this.#faceWidth = Math.floor(this.canvas.width / (5 * this.#windowScale));
        if (Math.floor(this.canvas.height / (4 * this.#windowScale)) < this.#faceWidth) {
            this.#faceWidth = Math.floor(this.canvas.height / (4 * this.#windowScale));
        }
        this.#stickerWidth = Math.floor(this.#faceWidth / 3);
        this.#stickerBorderWidth = Math.floor(this.#faceWidth / 30);
        this.#faceWidth = (3 * this.#stickerWidth + 3 * this.#stickerBorderWidth);
    }

    paintCubeNet() {
        // Below is to make sure canvas scales correctly to make non-blurry lines
        this.canvas = document.getElementById("cube-net-display");
        let context = this.canvas.getContext("2d");
        
        const sWidth = this.canvas.parentElement.clientWidth;
        const sHeight = this.canvas.parentElement.clientHeight;
    
        this.canvas.style.width = sWidth + "px";
        this.canvas.style.height = sHeight + "px";
    
        this.#windowScale = window.devicePixelRatio;
        this.canvas.width = sWidth * this.#windowScale;
        this.canvas.height = sHeight * this.#windowScale;
    
        context.scale(this.#windowScale, this.#windowScale);
        // canvas set up ends here

        this.updatePanelDimension();
    
        let centerFaceTopLeftCornerX = Math.floor(this.canvas.width / (2 * this.#windowScale)) - (this.#faceWidth * 2);
        let centerFaceTopLeftCornerY = Math.floor(this.canvas.height / (2 * this.#windowScale)) - Math.floor(this.#faceWidth / 2);
        
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
        context.fillStyle = sticker.displayColor;
        
        sticker.setBounds(stickerStartX + this.#stickerBorderWidth, stickerStartY + this.#stickerBorderWidth,
                Math.floor((this.#faceWidth - (3 * this.#stickerBorderWidth)) / 3),
                Math.floor((this.#faceWidth  - (3 * this.#stickerBorderWidth)) / 3));
        context.fillRect(sticker.x, sticker.y, sticker.width, sticker.height);
        this.paintMemo(context, sticker);
    }

    paintMemo(context, sticker) {
        if (sticker.pieceType != this.#memoEditMode) {
            return;
        }

        let memoChar = sticker.memoChar;
        context.font = `${this.#stickerWidth / 2}px Helvetica`;

        if (sticker.conflicted === true) {
            context.fillStyle = "#FA5E5E";
        } else {
            context.fillStyle = "#000000";
        }

        // console.log((memoChar));
        // console.log(context.measureText(memoChar));

        let charMetrics = context.measureText(memoChar);
        let charWidth = charMetrics.width;
        let charHeight = charMetrics.fontBoundingBoxAscent;

        context.fillText(memoChar, sticker.x + (this.#stickerWidth / 2) - (charWidth / 2), sticker.y + (this.#stickerWidth / 2) + (charHeight / 2));
    }

    setMemoEditMode(memoEditMode) {
        this.#memoEditMode = memoEditMode;
        localStorage.setItem("memoEditMode", memoEditMode.toString());
    }

    switchMemoEditMode() {
        this.turnOffEditMode();
        if (this.#memoEditMode == PieceType.Corner) {
            this.setMemoEditMode(PieceType.Edge);
            return 'edges';
        }
        else {
            this.setMemoEditMode(PieceType.Corner);
            return 'corners';
        }
    }
}
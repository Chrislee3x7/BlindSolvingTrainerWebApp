function startButtonClick() {
    window.location = './trainer.html';
}

function resetMemoSchemeButtonClick() {
    
}

function main() {
    setUpCube();
    paintCubeNet();
}

function setUpCube() {

}

function paintCubeNet() {
    // Below is to make sure canvas scales correctly to make non-blurry lines
    let canvas = document.getElementById("cube-net-display");
    let context = canvas.getContext("2d");
    
    const sWidth = 1000;
    const sHeight = 500;

    canvas.style.width = sWidth + "px";
    canvas.style.height = sHeight + "px";

    let scale = window.devicePixelRatio;
    canvas.width = sWidth * scale;
    canvas.height = sHeight * scale;

    context.scale(scale, scale);
    // canvas set up ends here

    let faceWidth = canvas.width / 5;

    let centerFaceTopLeftCornerX = (canvas.width / 2) - (faceWidth * 2);
    let centerFaceTopLeftCornerY = (canvas.height / 2) - (faceWidth / 2);
    paintCubeFace(context, );
}

function paintCubeFace(context, faceStartX, faceStartY, faceIndex) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(10, 10, 40, 40);

    // cubeFace
}
function startButtonClick() {
    window.location = './trainer.html';
}

function resetMemoSchemeButtonClick() {
    
}

let cubeNetDisplay;

function main() {
    let cube = new Cube();
    cubeNetDisplay = new CubeNetDisplay(cube);
    cubeNetDisplay.paintCubeNet();
    window.addEventListener("resize", repaintCubeNetDisplay);
}

function repaintCubeNetDisplay() {
    cubeNetDisplay.paintCubeNet();
}

function memoEditModeButtonClick() {

}

function setUpCube() {

}
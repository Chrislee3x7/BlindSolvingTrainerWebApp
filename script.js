function startButtonClick() {
    window.location = './trainer.html';
}

function resetMemoSchemeButtonClick() {
    
}

function main() {
    let cube = new Cube();
    let cubeNetDisplay = new CubeNetDisplay(cube);
    cubeNetDisplay.paintCubeNet();
}

function setUpCube() {

}
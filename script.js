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
    let newMode = cubeNetDisplay.switchMemoEditMode();
    this.repaintCubeNetDisplay();
    let button = document.querySelector('#change-memo-edit-mode-button');
    button.innerHTML = newMode;

}

function startButtonClick() {
    window.location = './trainer.html';
}

function resetMemoSchemeButtonClick() {
    
}
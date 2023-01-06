let cubeNetDisplay;

function main() {
    let cube = new Cube();
    cubeNetDisplay = new CubeNetDisplay(cube);
    let storedMemoEditMode = localStorage.getItem("memoEditMode");
    if (storedMemoEditMode == PieceType.Edge.toString()) {
        let button = document.querySelector('#change-memo-edit-mode-button');
        button.innerHTML = cubeNetDisplay.switchMemoEditMode();
    }
    cubeNetDisplay.paintCubeNet();
    window.addEventListener("resize", repaintCubeNetDisplay);
}

function repaintCubeNetDisplay() {
    cubeNetDisplay.paintCubeNet();
}

function memoEditModeButtonClick() {
    let button = document.querySelector('#change-memo-edit-mode-button');
    let newMode = cubeNetDisplay.switchMemoEditMode();
    button.innerHTML = newMode;
    this.repaintCubeNetDisplay();
}

function startButtonClick() {
    window.location = './trainer.html';
}

function resetMemoSchemeButtonClick() {
    
}
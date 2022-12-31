function startButtonClick() {
    window.location = './trainer.html';
}

function resetMemoSchemeButtonClick() {
    
}

function paintCubeNet() {
    // Below is to make sure canvas scales correctly to make non-blurry lines
    var canvas = document.getElementById("cube-net-display");
    var context = canvas.getContext("2d");
    
    const sWidth = 1000;
    const sHeight = 500;

    canvas.style.width = sWidth + "px";
    canvas.style.height = sHeight + "px";

    var scale = window.devicePixelRatio;
    canvas.width = sWidth * scale;
    canvas.height = sHeight * scale;

    context.scale(scale, scale);
    // canvas set up ends here

    context.fillRect(10, 10, 200, 100);
    
    context.translate(0.5, 0.5);
    context.moveTo(0, 0);
    context.lineTo(200, 100);
    context.stroke();
}
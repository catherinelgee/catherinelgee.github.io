var screenWidth;
var screenHeight;

var canvas;
var context;
var mouse;
var mouseX;
var mouseY;
var down = false;

function init()
{
    canvas = document.getElementById("myCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    canvas.style.width = document.body.clientWidth;
    canvas.style.height = document.body.clientHeight;
    context = canvas.getContext("2d");
    screenWidth = canvas.width;
    screenHeight = canvas.height;

    context.font = "48px Roboto";
    context.textAlign = "center";
    context.fillText("PAINT THE SITE", screenWidth / 2, (screenHeight / 2) - 30);

    context.font = "36px Roboto";
    context.textAlign = "center";
    context.fillText("click to start painting", screenWidth / 2, (screenHeight / 2));

    run();
}

function run() {
    while (true) {
        canvas.addEventListener('mousedown', function(e) {
            getCursorPosition(canvas, e)
        });
        context.fillRect(mouseX, mouseY, 1, 1);
    }

}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
}


//driver code
init(); //idk

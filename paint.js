var screenWidth;
var screenHeight;

var canvas;
var context;
var mouse;
var mouseX;
var mouseY;
var down = false;

function init() {
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
  context.fillText("PAINT THE SITE", screenWidth / 2, screenHeight / 2 - 30);

  context.font = "36px Roboto";
  context.textAlign = "center";
  context.fillText(
    "click to start painting",
    screenWidth / 2,
    screenHeight / 2
  );

  run();
}

function run() {
  canvas.addEventListener("mousedown", isDown);
  canvas.addEventListener("mousemove", function(e) {
    getCursorPosition(canvas, e);
  });
  canvas.addEventListener("mouseup", isDown); //this might not work
}

function isDown() {
  down = !down;
}

function getCursorPosition(canvas, event) {
  if (down) {
    const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  context.fillRect(mouseX, mouseY, 5, 5);
  }
}

//driver code
init(); //idk

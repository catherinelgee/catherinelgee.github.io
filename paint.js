var screenWidth;
var screenHeight;

var canvas;
var context;
var mouse;
var prevX;
var prevY;
var mouseX;
var mouseY;
var down = false;
var fresh = true;

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
    "paint: click/drag; clear: crtl+alt+n",
    screenWidth / 2,
    screenHeight / 2
  );




  run();
}

function run() {
  context.lineWidth = 1;
  canvas.addEventListener("mousedown", function(e) {
    isDown(e);
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mousemove", function(e) {
    draw(e);
  });
  canvas.addEventListener("mouseup", isDown); //this might not work

  window.addEventListener("keydown", function(e) {
    clearCanvas(canvas, e);
  });
}

function isDown(event) {
  if(event.button == 0) {
    down = !down;
  }
}

//ITERATION 1
function getCursorPosition(canvas, event) {
  if (down) {
    const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  context.fillRect(mouseX, mouseY, 1, 1);
  }
}

//ITERATION 2
function drawLines(canvas, event) {
  if (down) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    if (fresh) {
      prevX = mouseX;
      prevY = mouseY;
    }

    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(mouseX, mouseY);
    context.stroke();

    prevX = mouseX;
    prevY = mouseY;
  }
}

//ITERATION 3
function draw(e){
  if(!down) return;
  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
}


function clearCanvas(canvas, event) {
  console.log("something is clicked");
  if(event.code == "KeyN" && event.altKey && event.ctrlKey) { //does it work like this??

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "48px Roboto";
    context.textAlign = "center";
    context.fillText("PAINT THE SITE", screenWidth / 2, screenHeight / 2 - 30);

    context.font = "36px Roboto";
    context.textAlign = "center";
    context.fillText(
      "paint: click/drag; clear: crtl+alt+n",
      screenWidth / 2,
      screenHeight / 2
    );
    }
}

init();

var screenWidth;
var screenHeight;

var canvas;
var context;
var mouse;
//var prevX; var prevY;
var mouseX;
var mouseY;
var down = false;
//var fresh = true;
const colors = [
  { x: 10, y: 10, width: 20, color: '#de0434'},
  { x: 40, y: 10, width: 20, color: '#f2b007'},
  { x: 70, y: 10, width: 20, color: '#f2f207'},
  { x: 100, y: 10, width: 20, color: '#08d119'},
  { x: 130, y: 10, width: 20, color: '#0675c9'},
  { x: 160, y: 10, width: 20, color: "#3d06c9"},
  { x: 190, y: 10, width: 20, color: "#8206c9"},
  { x: 220, y: 10, width: 20, color: "#000"},
  { x: 250, y: 10, width: 20, color: "#fff"},
];


var bbox = {x:10,y:10, w:100, h:100};

function drawBase(canvas, context) {
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

  colors.forEach(c => {
    context.beginPath();
    context.rect(c.x, c.y, c.width, c.width);
    context.fillStyle = c.color;
    context.fill();
    context.strokeStyle = "#000";
    context.stroke();
  })
  }

/*function helperSquares(x, y, color, ctx) {
  ctx.beginPath();
  ctx.rect(x, y, 20, 20);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}*/

function init() {
  canvas = document.getElementById("myCanvas");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  canvas.style.width = document.body.clientWidth;
  canvas.style.height = document.body.clientHeight;
  context = canvas.getContext("2d");
  screenWidth = canvas.width;
  screenHeight = canvas.height;

  drawBase(canvas, context);
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
  canvas.addEventListener("click", menuCheck);
}

function isIntersect(point, c) {
  return point.x > c.x && point.x < (c.x + c.width) && point.y > c.y && point.y < (c.y + c.width);
  //return Math.sqrt((point.x-c.x) ** 2 + (point.y - c.y) ** 2) < c.width;
}

function menuCheck(event) {
  const rect = canvas.getBoundingClientRect();
  const xy = {x: event.clientX - rect.left, y: event.clientY - rect.top};
  console.log(xy.x);
  console.log(xy.y);

  colors.forEach(c => {
    if (isIntersect(xy, c)) {
      context.strokeStyle = c.color;
    }
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
/*function drawLines(canvas, event) {
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
}*/

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
    drawBase(canvas, context);
    }
}

init();

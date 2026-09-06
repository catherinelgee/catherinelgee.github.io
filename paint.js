//////////////////////////////
// GLOBAL STATE
/////////////////////////////

// what the user actually paints/erases with
const brush = { color: "#000", lineWidth: 4 };

// pointer interaction state
var down = false;
var erasing = false;

var canvas;
var context;
var screenWidth;
var screenHeight;

const UI_BORDER_WIDTH = 1;
const SELECTION_OUTLINE_WIDTH = 3;
const SELECTION_OUTLINE_PAD = 4;
const ROW_MARGIN = 10;

const colors = [
  { color: '#de0434' },
  { color: '#f2b007' },
  { color: '#f2f207' },
  { color: '#08d119' },
  { color: '#0675c9' },
  { color: "#3d06c9" },
  { color: "#8206c9" },
  { color: "#000" },
  { color: "#fff" },
];
var selectedColor = colors.find(c => c.color === brush.color);

const sizes = [
  { lineWidth: 4, label: "S" },
  { lineWidth: 8, label: "M" },
  { lineWidth: 14, label: "L" },
];
var selectedSize = sizes.find(s => s.lineWidth === brush.lineWidth);

//////////////////////////////
// SETUP
/////////////////////////////

function init() {
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");

  resizeCanvas();
  bindEvents();
}

function bindEvents() {
  canvas.addEventListener("contextmenu", e => e.preventDefault());

  canvas.addEventListener("mousedown", e => {
    if (e.button === 2) {
      erasing = true;
    } else if (e.button === 0) {
      down = true;
    } else {
      return;
    }
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopStroke);
  canvas.addEventListener("mouseleave", stopStroke);
  canvas.addEventListener("click", handlePick);

  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    down = true;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    context.beginPath();
    context.moveTo(t.clientX - rect.left, t.clientY - rect.top);
    handlePick(t);
  }, { passive: false });
  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    draw(e.touches[0]);
  }, { passive: false });
  canvas.addEventListener("touchend", stopStroke);

  window.addEventListener("keydown", e => {
    if (e.code === "KeyN" && e.altKey && e.ctrlKey) resetCanvas();
  });
  window.addEventListener("resize", resizeCanvas);
}

function stopStroke() {
  down = false;
  erasing = false;
}

//////////////////////////////
// DRAWING
/////////////////////////////

function draw(e) {
  if (!down && !erasing) return;
  context.strokeStyle = brush.color;
  context.lineWidth = brush.lineWidth;
  context.lineCap = "round";
  context.globalCompositeOperation = erasing ? "destination-out" : "source-over";

  const point = ("offsetX" in e) ? { x: e.offsetX, y: e.offsetY }
    : offsetFromClient(e.clientX, e.clientY);
  context.lineTo(point.x, point.y);
  context.stroke();
  context.globalCompositeOperation = "source-over";
}

function offsetFromClient(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function resizeCanvas() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  canvas.style.width = canvas.width + "px";
  canvas.style.height = canvas.height + "px";
  screenWidth = canvas.width;
  screenHeight = canvas.height;

  layoutRow(colors, ROW_MARGIN);
  layoutRow(sizes, ROW_MARGIN * 2 + rowItemSize());

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawInstructions();
  drawColorRow();
  drawSizeRow();
}

function resetCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawInstructions();
  drawColorRow();
  drawSizeRow();
}

function rowItemSize() {
  return Math.max(16, Math.min(32, screenWidth * 0.03));
}

function layoutRow(items, y) {
  const size = rowItemSize();
  items.forEach((item, i) => {
    item.x = ROW_MARGIN + i * (size + ROW_MARGIN);
    item.y = y;
    item.width = size;
  });
}

function rowBounds(items) {
  const pad = SELECTION_OUTLINE_PAD + SELECTION_OUTLINE_WIDTH;
  const first = items[0];
  const last = items[items.length - 1];
  return {
    x: first.x - pad,
    y: first.y - pad,
    width: (last.x + last.width) - first.x + pad * 2,
    height: last.width + pad * 2,
  };
}

function drawInstructions() {
  context.textAlign = "center";
  context.font = "48px Roboto";
  context.fillText("PAINT THE SITE", screenWidth / 2, screenHeight / 2 - 30);
  context.font = "36px Roboto";
  context.fillText(
    "left-click/drag: paint; right-click/drag: erase; clear: crtl+alt+n",
    screenWidth / 2,
    screenHeight / 2
  );
}

// Renders a row of equal-size boxes, one per item, highlighting `selected`.
// `drawContent(item)` paints whatever goes inside a box (a color fill, a size dot, ...).
function drawRow(items, selected, drawContent) {
  const band = rowBounds(items);
  context.clearRect(band.x, band.y, band.width, band.height);

  items.forEach(item => drawContent(item));

  context.save();
  context.lineWidth = UI_BORDER_WIDTH;
  context.strokeStyle = "#000";
  items.forEach(item => context.strokeRect(item.x, item.y, item.width, item.width));
  context.restore();

  if (selected) drawSelectionOutline(selected);
}

function drawColorRow() {
  drawRow(colors, selectedColor, item => {
    context.save();
    context.fillStyle = item.color;
    context.fillRect(item.x, item.y, item.width, item.width);
    context.restore();
  });
}

function drawSizeRow() {
  drawRow(sizes, selectedSize, item => {
    const cx = item.x + item.width / 2;
    const cy = item.y + item.width / 2;
    context.save();
    context.fillStyle = "#000";
    context.beginPath();
    context.arc(cx, cy, item.lineWidth / 2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function drawSelectionOutline(item) {
  context.save();
  context.lineWidth = SELECTION_OUTLINE_WIDTH;
  context.strokeStyle = "#000";
  const pad = SELECTION_OUTLINE_PAD;
  context.strokeRect(item.x - pad, item.y - pad, item.width + pad * 2, item.width + pad * 2);
  context.restore();
}

//////////////////////////////
// SELECTION
/////////////////////////////

function isIntersect(point, item) {
  return point.x > item.x && point.x < item.x + item.width
    && point.y > item.y && point.y < item.y + item.width;
}

function handlePick(event) {
  const point = offsetFromClient(event.clientX, event.clientY);

  const clickedColor = colors.find(c => isIntersect(point, c));
  if (clickedColor) {
    selectedColor = clickedColor;
    brush.color = clickedColor.color;
    drawColorRow();
  }

  const clickedSize = sizes.find(s => isIntersect(point, s));
  if (clickedSize) {
    selectedSize = clickedSize;
    brush.lineWidth = clickedSize.lineWidth;
    drawSizeRow();
  }
}

//////////////////////////////
// RUN
/////////////////////////////

init();

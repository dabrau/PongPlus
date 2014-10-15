var x = 5;
var y = 75;
var dx = 2;
var dy = 1;
var paddle1y;
var paddle1h;
var paddlew;
var ctx;
var width = 150;
var height = 150;

function init(){
  var canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  return setInterval(draw,10);
}

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0,Math.PI*2,true); // Outer circle
  ctx.closePath();
  ctx.fill();
}

function init_paddle1() {
  paddle1y = height / 2;
  paddle1h = 75;
  paddlew = 10;
}

function rect(x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, width, height);
}
function draw() {
  clear();
  circle(x, y, 5)
  rect(0, paddle1y , paddlew, paddle1h);
  if (y + dy > height || y + dy < 0) {
    dy *= -1;
  } 
  if (x + dx > height)
    dx = -dx;
  else if (x + dx < 0) {
    if (y > paddle1y && y < paddle1y + paddle1h) {
      dx = -dx;
    }
  }
  x += dx;
  y += dy;
}
init();
init_paddle1();
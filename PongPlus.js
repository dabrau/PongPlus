var x = 5;
var y = 75;
var dx = 2;
var dy = 2;
// var paddlex;
// var paddleh;
// var paddlew;
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

// function init_paddle() {
//   paddlex = WIDTH / 2;
//   paddleh = 10;
//   paddlew = 75;
// }

// function rect(x, y, w, h) {
//   ctx.beginPath();
//   ctx.rect(x, y, w, h);
//   ctx.closePath();
//   ctx.fill();
// }

function clear() {
  ctx.clearRect(0, 0, width, height);
}
function draw() {
  clear();
  circle(x, y, 5)
  rect(paddlex, height-paddleh, paddlew, paddleh);
  if (x + dx > width || x + dx < 0) {
    dx *= -1;
  } 
  if (y + dy > width || y + dx < 0) {
    dy *= -1;
  } 
  x += dx;
  y += dy;
}
init();
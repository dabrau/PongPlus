var x = 5;
var y = 75;
var dx = 2;
var dy = 0;
var ballRadius = 5;
var paddle1y;
var paddle1h;
var paddlew;
var paddle1sensitivity = 2
var ctx;
var width = 150;
var height = 150;
var game = true;


function init(){
  var canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  return intervalId = setInterval(draw,10);
}

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0,Math.PI*2,true); // Outer circle
  ctx.closePath();
  ctx.fill();
}

function init_paddle1() {
  paddle1y = height / 2;
  paddle1h = 50;
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

upPressed = false;
downPressed = false;


function onKeyDown(e) {
  if (e.keyCode == 38) {
    upPressed = true; 
  }
  else if (e.keyCode == 40) {
    downPressed = true;
  }
}


function onKeyUp(e) {
  if (e.keyCode == 38) {
    upPressed = false;
  }
  else if (e.keyCode == 40) {
    downPressed = false;
} }

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);
function draw() {
  clear();
  circle(x, y, ballRadius)

  if (upPressed && paddle1y > 0) {
    paddle1y -= paddle1sensitivity;
  } else if (downPressed && paddle1y + paddle1h < height) {
    paddle1y += paddle1sensitivity;
  }

  rect(0, paddle1y , paddlew, paddle1h);
  if (y + dy > height || y + dy < 0) {
    dy = -dy;
  } 
  if (x + dx > height)
    dx = -dx;
  else if (x + dx < 0) {
    if (y > paddle1y && y < paddle1y + paddle1h) {
      dy = 1 * ((y-(paddle1y+paddle1h/2))/paddlew);
      dx = -dx;
    } else {
      clearInterval(intervalId);
      alert("Thanks for playing!")
    }
  }

  x += dx;
  y += dy;
}
init();
init_paddle1();
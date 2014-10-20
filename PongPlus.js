var x;
var y;
var dx;
var dy;
var ballRadius;

var paddle1y;
var paddle1h;
var paddlew;
var paddle1sensitivity = 2

var paddle2y;
var paddle2h;
var paddlew;
var paddle2sensitivity = 2

var ctx;
var width = 150;
var height = 150;

$("#start").on('click', start);

function start(){
  resetControls();
  init_ball();
  init_paddle1();
  init_paddle2();
  var canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  return intervalId = setInterval(draw,10);
}

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0,Math.PI*2,true); 
  ctx.closePath();
  ctx.fill();
}

function init_ball() { 
  x = 15;
  y = 75;
  dx = 2;
  dy = 0;
  ballRadius = 5;
}

function init_paddle1() {
  paddle1h = 50;
  paddlew = 10;
  paddle1y = height / 2 - paddle1h / 2 ;
}

function init_paddle2() {
  paddle2h = 50;
  paddlew = 10;
  paddle2y = height / 2 - paddle2h / 2;
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

var upPressed;
var downPressed;
var wPressed;
var sPressed;

function resetControls () {
  upPressed = false;
  downPressed = false;
  wPressed = false;
  sPressed = false;
}

function onP1KeyDown(e) {
  if (e.keyCode == 87) {
    upPressed = true; 
  }
  else if (e.keyCode == 83) {
    downPressed = true;
  }
}

function onP1KeyUp(e) {
  if (e.keyCode == 87) {
    upPressed = false;
  }
  else if (e.keyCode == 83) {
    downPressed = false;
  }   
}

wPressed = false;
sPressed = false;

function onP2KeyDown(e) {
  if (e.keyCode == 38) {
    wPressed = true; 
  }
  else if (e.keyCode == 40) {
    sPressed = true;
  }
}

function onP2KeyUp(e) {
  if (e.keyCode == 38) {
    wPressed = false;
  }
  else if (e.keyCode == 40) {
    sPressed = false;
  }   
}


$(document).keydown(onP1KeyDown);
$(document).keyup(onP1KeyUp);

$(document).keydown(onP2KeyDown);
$(document).keyup(onP2KeyUp);

function draw() {
  clear();
  circle(x, y, ballRadius)

  if (upPressed && paddle1y > 0) {
    paddle1y -= paddle1sensitivity;
  } else if (downPressed && paddle1y + paddle1h < height) {
    paddle1y += paddle1sensitivity;
  }

    if (wPressed && paddle2y > 0) {
    paddle2y -= paddle2sensitivity;
  } else if (sPressed && paddle2y + paddle2h < height) {
    paddle2y += paddle2sensitivity;
  }

  rect(width - paddlew, paddle2y , paddlew, paddle2h);
  rect(0, paddle1y , paddlew, paddle1h);
  if (y + dy - 3 > height || y + dy + 3 < 0) {
    dy = -dy;
  } 
  if (x + dx - 3 > width - paddlew) {
    if (y > paddle2y && y < paddle2y + paddle1h) {
      dy = Math.sin(((y-(paddle2y+paddle2h/2)))/(paddle2h/2) * 1.22) * 2;
      dx = -Math.cos(((y-(paddle2y+paddle2h/2)))/(paddle2h/2) * 1.22) * 2;
    } else {
      clearInterval(intervalId);
      clear();
      alert("Thanks for playing!")
    }
  }
  else if (x + dx + 3 < paddlew) {
    if (y > paddle1y && y < paddle1y + paddle1h) {
      dy = Math.sin(((y-(paddle1y+paddle1h/2)))/(paddle1h/2) * 1.22) * 2;
      dx = Math.cos(((y-(paddle1y+paddle1h/2)))/(paddle1h/2) * 1.22) * 2;
    } else {
      clearInterval(intervalId);
      clear();
      alert("Thanks for playing!");
    }
  } 


  x += dx;
  y += dy;
}


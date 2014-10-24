var gameSpace = {
  height: 150,
  width: 150
}

var ball = {
  x: undefined,
  y: undefined,
  dx: undefined,
  dy: undefined,
  v: undefined, //velocity
  r: undefined, //radius
  collisionPadding: undefined,


  nextYposition: function() {
    return this.y + this.dy;
  },

  hitTopWall: function() {
    return this.nextYposition() - this.collisionPadding < 0;
  },

  hitBottomWall: function() {
    return this.nextYposition() + this.collisionPadding > gameSpace.height;
  },

  wallCollision: function() {
      this.dy = -this.dy;
  },

  hitLpaddle: function() {
    return this.x + this.collisionPadding + this.dx <= paddleL.surface && this.y >= paddleL.yTop && this.y <= paddleL.yBottom();;
  },

  hitRpaddle: function() {
    return this.x - this.collisionPadding + this.dx >= paddleR.surface && this.y >= paddleR.yTop && this.y <= paddleR.yBottom();
  },

  paddleCollision: function(paddle) {
    var angleCoefficient = (this.y - paddle.yMid()) / (paddle.h / 2);
    var maxAngleRadians = 1.22;
    var collisionAngle = angleCoefficient * maxAngleRadians;
    var dxNew = Math.cos(collisionAngle);
    this.dy = Math.sin(collisionAngle)  * this.v;
    if (this.dx > 0) {
      this.dx = -dxNew * this.v;
    } else {
      this.dx = dxNew * this.v;
    }
  },

  move: function() {
    this.x += this.dx;
    this.y += this.dy;
  },

  out: function() {
    return this.x < 0 || this.x > gameSpace.width;
  },

  directionChange: function() {
    if (this.hitTopWall()) {
      this.wallCollision();
    } else if (this.hitBottomWall()) {
      this.wallCollision();
    } else if (this.hitLpaddle()) {
      this.paddleCollision(paddleL);
    } else if (ball.hitRpaddle()) {
      this.paddleCollision(paddleR);
    }
  }
}

function Paddle(h, w, x, sens) {
  this.yTop = gameSpace.height / 2 - h / 2 ;
  this.h = h;
  this.w = w;
  this.x = x;
  this.surface = undefined;
  this.sens = sens;
  this.upPressed = false;
  this.downPressed = false;
}
Paddle.prototype.yBottom = function () {
  return this.h + this.yTop;
}

Paddle.prototype.yMid = function () {
  return this.h / 2 + this.yTop
}


Paddle.prototype.moveUp = function() {
  this.yTop -= this.sens;
}

Paddle.prototype.moveDown = function() {
  this.yTop += this.sens;
}

Paddle.prototype.validUpMove = function() {
  return this.yTop >= 0;
}

Paddle.prototype.validDownMove = function() {
  return this.yBottom() <= gameSpace.height;
}



var paddleL;
var paddleR;


var gameState = function() { 
  return {
    "x":ball.x,
    "y":ball.y,
    "l":paddleL.yTop,
    "r":paddleR.yTop,
  }
};



var gameController = {};


  gameController.initBall = function() {
    ball.x = 40;
    ball.y = gameSpace.height / 2;
    ball.dx = 2;
    ball.dy = 0;
    ball.v = 2;
    ball.r = 5;
    ball.collisionPadding = 3;
  };

  gameController.initPaddleL = function() {
    paddleL = new Paddle(50, 10, 0, 2);
    paddleL.surface = 0 + paddleL.w;
  };

  gameController.initPaddleR = function() {
    paddleR = new Paddle(50, 10, gameSpace.width - 10, 2);
    paddleR.surface = paddleR.x;
  };

  gameController.init = function() {
    this.getGameSpace("canvas");
    this.initBall();
    this.initPaddleL();
    this.initPaddleR();
  };

  gameController.intervalId = undefined;

  gameController.start = function() {
    gameController.init();
    return intervalId = setInterval(gameController.pong, 10);
  };

  gameController.pong = function() {
    
    if (paddleR.upKeyPressed && paddleR.validUpMove()) {
      paddleR.moveUp();
    } else if (paddleR.downKeyPressed && paddleR.validDownMove()){
      paddleR.moveDown();
    }

    ball.directionChange();

    if (ball.out()) {
      clearInterval(intervalId);
    };

    ball.move();
  };
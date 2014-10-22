var gameSpace = {
	height: undefined,
	width: undefined,
	ctx: undefined,
	clear: function() {
  	this.ctx.clearRect(0, 0, this.width, this.height);
	},
	draw: function() {
		ball.draw();
		paddleL.draw();
		paddleR.draw();
	}
}

var ball = {
	x: undefined,
	y: undefined,
	dx: undefined,
	dy: undefined,
	v: undefined, //velocity
	r: undefined, //radius
	collisionPadding: undefined,

	draw: function() {
  	gameSpace.ctx.beginPath();
  	gameSpace.ctx.arc(this.x, this.y, this.r, 0,Math.PI*2,true); 
  	gameSpace.ctx.closePath();
  	gameSpace.ctx.fill();
	},

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

Paddle.prototype.draw = function() {
	gameSpace.ctx.fillRect(this.x, this.yTop, this.w, this.h);
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






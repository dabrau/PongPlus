var gameSpace = {
	height: undefined,
	width: undefined,
	ctx: undefined,
}

var ball = {
	x: undefined,
	y: undefined,
	dx: undefined,
	dy: undefined,
	v: undefined,
	r: undefined,
	collisionPadding: this.r / 2,

	draw: function() {
  	gameSpace.ctx.beginPath();
  	gameSpace.ctx.arc(ball.x, ball.y, ball.r, 0,Math.PI*2,true); 
  	gameSpace.ctx.closePath();
  	gameSpace.ctx.fill();
	},

	hitwall: function() {
		var yCollisionPos = this.y + this.dy;
		return yCollisionPos - this.collisionPadding > gameSpace.height || yCollisionPos + this.collisionPadding < 0;
	},

	wallCollision: function() {
		  this.dy = -(this.dy);
	},

	hitLpaddle: function() {
		return this.x - this.r + this.dx <= paddleL.surface && this.y >= paddleL.y && this.y <= paddleL.yBottom;
	},

	hitRpaddle: function() {
		return this.x + this.r + this.dx >= paddleR.surface && this.y >= paddleL.y && this.y <= paddleR.yBottom;
	},

	paddleCollision: function(paddle) {
		var angleCoefficient = (y - paddle.yMid) / (paddle.h / 2);
		var maxAngleRadians = 1.22;
		var collisionAngle = angleCoefficient * maxAngleRadians;
		this.dy = Math.sin(collisionAngle)  * v;
		this.dx = dx/-dx * Math.cos(collisionAngle) * v;
	},

	move: function() {
		this.x += this.dx;
		this.y += this.dy;
	}
}

function Paddle(h, w, x, sens) {
	this.yTop = gameSpace.height / 2 - h / 2 ;
	this.h = h;
	this.w = w;
	this.x = x;
	this.yBottom = this.h + this.y;
	this.yMid = (this.h / 2 + this.y);
	this.sens = sens; 
}

Paddle.prototype.draw = function() {
	gameSpace.ctx.fillRect(this.x, this.yTop, this.w, this.h);
}

Paddle.prototype.moveUp = function() {
	this.yTop += this.sens;
}

Paddle.prototype.moveDown = function() {
	this.yTop -= this.sens;
}

Paddle.prototype.validMove = function() {
	return this.yTop >= 0 && this.yBottom <= gameSpace.height; 
}

var paddleL;
var paddleR;






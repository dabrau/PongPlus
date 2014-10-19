var gameSetting = {
	height:,
	width:,
}

var ball = {
	x:,
	y:,
	d:,
	dx:,
	dy:,
	v:,
	r:,

	draw: function () {
  	ctx.beginPath();
  	ctx.arc(ball.x, ball.y, ball.r, 0,Math.PI*2,true); 
  	ctx.closePath();
  	ctx.fill();
	},

	hitwall: function() {
		return this.y + this.dy > game.height || this.y + this.dy < 0;
	},

	wallCollision: function () {
		  this.dy = -(this.dy);
	},

	hitLpaddle: function() {
		return this.x - this.r + this.dx <= paddleL.surface && this.y >= paddleL.y && this.y <= paddleL.yBottom;
	},

	hitRpaddle: function() {
		return this.x + this.r + this.dx >= paddleR.surface && this.y >= paddleL.y && this.y <= paddleR.yBottom;
	},

	paddleCollision: function (paddle) {
		var angleCoefficient = (y - paddle.yMid) / (paddle.h / 2);
		var maxAngleInRadians = 1.22;
		var collisionAngle = angleCoefficient * maxAngleInRadians;
		this.dy = Math.sin(collisionAngle)  * v;
		this.dx = -Math.cos(collisionAngle) * v;
	}
}

function Paddle(y, h, w, sens) {
	this.y:,
	this.h:,
	this.w:,
	this.surface:
	this.yBottom: h + y;
	this.yMid: (this.h / 2 + this.y)
	this.sens:, 
	this.draw: function() {
  	ctx.beginPath();
  	ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  	ctx.closePath();
  	ctx.fill();
	}
}


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
		this.dy = (y - paddle.yMid) * Math.sin(.6)  * speed
		this.dx = -(Math.sqrt(speed**2 - this.dy**2))
	}
}

function Paddle(y, h, w, sens) {
	this.y:,
	this.h:,
	this.w:,
	this.surface:
	this.yBottom: h + y;
	this.yMid: (h + y) / 2
	this.sens:, 
	this.draw: function() {
  	ctx.beginPath();
  	ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  	ctx.closePath();
  	ctx.fill();
	}
}


function Game() {
	this.space = {
		width: 450,
		height: 300
	};

	this.player = {
		left: undefined,
		right: undefined
	};

	this.ball = new Ball(this.space);

	this.paddleL = new Paddle(this.space, 75, 10, 0, 5, 4);
	this.paddleL.surface = this.paddleL.w; //paddle width

	this.paddleR = new Paddle(this.space, 75, 10, this.space.width - 10, 5, 4);
	this.paddleR.surface = this.space.width - this.paddleR.w; //space width - paddle width
};

Game.prototype.state = function() {
	return {'x': this.ball.x, 'y': this.ball.y, 'l': this.paddleL.yTop, 'lh': this.paddleL.h, 'r': this.paddleR.yTop, 'rh': this.paddleR.h}
};

//shorten paddle and reposition when ball collides
Game.prototype.plusFeature = function(ball, paddleR, paddleL) {
 	if (ball.hitRpaddle(paddleR)) {
 		paddleR.shortenHeight();
 		paddleR.reposition();
 	} 
 	if (ball.hitLpaddle(paddleL)) {
 		paddleL.shortenHeight();
 		paddleL.reposition();
 	}
};

Game.prototype.pong = function() {
	this.paddleR.move(this.space)
	this.paddleL.move(this.space)
	this.plusFeature(this.ball, this.paddleR, this.paddleL);
	this.ball.directionChange(this.space, this.paddleL, this.paddleR);
	this.ball.move();
};

function Ball(space) {
	//initial ball properties
	this.x =  parseInt(space.width / 4);
	this.y =  parseInt(space.height / 2);
	this.dx = 5;
	this.dy = 0;
	this.v = 5; //velocity
	this.r = 5; //radius
	this.collisionPadding = 6;
	this.maxBounceAngleRadians = 1.22;
}

Ball.prototype.nextYposition = function() {
	return this.y + this.dy;
};

Ball.prototype.hitTopWall = function() {
	return this.y - this.collisionPadding < 0;
};

Ball.prototype.hitBottomWall = function(gameSpace) {
	return this.y + this.collisionPadding > gameSpace.height;
};

Ball.prototype.wallCollision = function() {
	this.dy = -this.dy;
};

Ball.prototype.withinPaddleBounds = function(paddle) {
	return this.y >= paddle.yTop && this.y <= paddle.yBottom();
}

Ball.prototype.nextXposition = function() {
	return this.x + this.dx;
}

Ball.prototype.hitLpaddle = function(paddle) {
	return this.nextXposition() + this.collisionPadding <= paddle.surface && this.withinPaddleBounds(paddle);
};

Ball.prototype.hitRpaddle = function(paddle) {
	return this.nextXposition() - this.collisionPadding >= paddle.surface && this.withinPaddleBounds(paddle);
};

Ball.prototype.angleCoefficient = function(paddle) {
	var coefficient = (this.y - paddle.yMid()) / (paddle.h / 2);
	return coefficient;
};

Ball.prototype.collisionAngle = function(coefficient) {
	var angle = coefficient * this.maxBounceAngleRadians;
	return angle;
};

Ball.prototype.dxNew = function(collisionAngle, v) {
	if (this.dx > 0)  {
		this.dx = parseInt(-Math.cos(collisionAngle) * v);
	} else {
		this.dx = parseInt(Math.cos(collisionAngle) * v);
	}
};

Ball.prototype.dyNew = function(collisionAngle, v) {
	this.dy = parseInt(Math.sin(collisionAngle)  * v);
};

Ball.prototype.paddleBounceDxDy = function(v, collisionAngle) {
	this.dxNew(collisionAngle, v);
	this.dyNew(collisionAngle, v);
}

Ball.prototype.paddleCollision = function(paddle, v) {
	this.paddleBounceDxDy(v, 
		this.collisionAngle(
			this.angleCoefficient(paddle)
		)
	)
};

Ball.prototype.move = function() {
	this.x += this.dx;
	this.y += this.dy;
};

Ball.prototype.out = function(gameSpace) {
	return this.x < 0 || this.x > gameSpace.width;
};

Ball.prototype.directionChange = function(space, paddleL, paddleR) {
	if (this.hitTopWall() || this.hitBottomWall(space)) {
		this.wallCollision();
	}
	if (this.hitLpaddle(paddleL)) {
		this.paddleCollision(paddleL, this.v);
	}
	if (this.hitRpaddle(paddleR)) {
		this.paddleCollision(paddleR, this.v);
	}
};


function Paddle(gameSpace, h, w, x, sens, shortenLength) {
	this.yTop = gameSpace.height / 2 - h / 2 ; //start the paddle in the middle of the game space
	this.h = h; //length of paddle
	this.shortenLength = shortenLength //number of pixels to shorten the paddle
	this.w = w; //width of paddle
	this.x = x; //x value at top left corner of the paddle 
	this.surface = undefined; // the side of the paddle where the ball should bounce
	this.sens = sens; //number of pixels moved per frame
	this.upPressed = false;
	this.downPressed = false;
};

Paddle.prototype.yBottom = function () {
	return this.h + this.yTop;
};

Paddle.prototype.yMid = function () {
	return this.h / 2 + this.yTop
};

Paddle.prototype.moveUp = function() {
	this.yTop -= this.sens;
};

Paddle.prototype.moveDown = function() {
	this.yTop += this.sens;
};

Paddle.prototype.validUpMove = function() {
	return this.yTop >= 0;
};

Paddle.prototype.validDownMove = function(gameSpace) {
	return this.yBottom() <= gameSpace.height;
};

//shorten the paddle 
Paddle.prototype.shortenHeight = function() {
	if (this.h - this.shortenLength < 1) {
		this.h = 1;
	} else {
		this.h -= this.shortenLength;
	}
};

Paddle.prototype.reposition = function() {
	this.yTop += this.shortenLength / 2; //reposition the paddle when it gets shorter
};

Paddle.prototype.move = function (space) {
	if (this.upPressed && this.validUpMove()) {
		this.moveUp();
	} else if (this.downPressed && this.validDownMove(space)){
		this.moveDown();
	}
};

module.exports = Game;


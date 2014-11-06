function Game(gameInstance) {
	this.space = {
		width: 450,
		height: 300
	};

	this.player = {
		left: undefined,
		right: undefined
	};

	this.ball = new Ball(this.space);

	this.paddleL = new Paddle(this.space, 75, 10, 0, 5, 5);
	this.paddleL.surface = 10; //paddle width

	this.paddleR = new Paddle(this.space, 75, 10, this.space.width - 10, 5, 5);
	this.paddleR.surface = 440; //space width - paddle width
}

Game.prototype.state = function() {
	return {'x': this.ball.x, 'y': this.ball.y, 'l': this.paddleL.yTop, 'lh': this.paddleL.h, 'r': this.paddleR.yTop, 'rh': this.paddleR.h}
};

//shorten paddle when ball collides and reposition
Game.prototype.plusFeature = function() {
 	if (this.ball.hitRpaddle(this.paddleR)) {
 		this.paddleR.shortenHeight();
 		this.paddleR.reposition();
 	} else if (this.ball.hitLpaddle(this.paddleL)) {
 		this.paddleL.shortenHeight();
 		this.paddleL.reposition();
 	}
}

Game.prototype.pong = function() {
	if (this.paddleR.upPressed && this.paddleR.validUpMove()) {
		this.paddleR.moveUp();
	} else if (this.paddleR.downPressed && this.paddleR.validDownMove(this.space)){
		this.paddleR.moveDown();
	}

	if (this.paddleL.upPressed && this.paddleL.validUpMove()) {
		this.paddleL.moveUp();
	} else if (this.paddleL.downPressed && this.paddleL.validDownMove(this.space)){
		this.paddleL.moveDown();
	} 

	this.plusFeature();

	this.ball.directionChange(this.space, this.paddleL, this.paddleR);

	this.ball.move();

};

function Ball(space) {
	//initial ball properties
	this.x =  space.width / 4;
	this.y =  space.height / 2;
	this.dx = 5;
	this.dy = 0;
	this.v = 5; //velocity
	this.r = 5; //radius
	this.collisionPadding = 6;
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

Ball.prototype.paddleCollision = function(paddle) {
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

Ball.prototype.move = function() {
	this.x += this.dx;
	this.y += this.dy;
},

Ball.prototype.out = function(gameSpace) {
	return this.x < 0 || this.x > gameSpace.width;
},

Ball.prototype.directionChange = function(space, paddleL, paddleR) {
	if (this.hitTopWall() || this.hitBottomWall(space)) {
		this.wallCollision();
	} else if (this.hitLpaddle(paddleL)) {
		this.paddleCollision(paddleL);
	} else if (this.hitRpaddle(paddleR)) {
		this.paddleCollision(paddleR);
	}
};


function Paddle(gameSpace, h, w, x, sens, shortenLength) {
	this.yTop = gameSpace.height / 2 - h / 2 ; //start the paddle in the middle of the game space
	this.h = h;
	this.shortenLength = shortenLength //number of pixels to shorten the paddle
	this.w = w;
	this.x = x;
	this.surface = undefined;
	this.sens = sens; //number of pixels moved per frame
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

Paddle.prototype.validDownMove = function(gameSpace) {
	return this.yBottom() <= gameSpace.height;
}

//shorten the paddle 
Paddle.prototype.shortenHeight = function() {
	if (this.h - this.shortenLength < 1) {
		this.h = 1;
	} else {
		this.h -= this.shortenLength;
	}
}

Paddle.prototype.reposition = function() {
	this.yTop += this.shortenLength / 2; //reposition the paddle when it gets shorter
}




module.exports = Game;


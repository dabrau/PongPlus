function Game(gameInstance) {
	this.gameID = gameInstance;

	this.gameInterval = undefined;

	this.space = {
		width: 150,
		height: 150
	};

	this.players = {
		self: undefined,
		other: undefined
	};

	this.ball = new Ball(this.space);

	this.paddleL = new Paddle(this.space, 50, 10, 0, 2);
	this.paddleL.surface = 10; //paddle width

	this.paddleR = new Paddle(this.space, 50, 10, this.space.width - 10, 2);
	this.paddleR.surface = 140; //space width - paddle width
}

Game.prototype.state = function() {
	return {'x': this.ball.x, 'y': this.ball.y, 'l': this.paddleL.yTop, 'r': this.paddleR.yTop}
};

// Game.prototype.start = function() {
// 		this.gameInterval = setInterval(this.pong(), 16);
// }; 

Game.prototype.pong = function() {
	if (this.paddleR.upPressed && this.paddleR.validUpMove(this.space)) {
		this.paddleR.moveUp();
	} else if (this.paddleR.downPressed && this.paddleR.validDownMove()){
		this.paddleR.moveDown();
	}

	if (this.paddleL.upPressed && this.paddleL.validUpMove(this.space)) {
		this.paddleL.moveUp();
	} else if (this.paddleL.downPressed && this.paddleL.validDownMove()){
		this.paddleL.moveDown();
	} 

	// if (this.ball.out(this.space)) {
	// 	clearInterval(this.gameInterval)
	// }

	this.ball.directionChange(this.space, this.paddleL, this.paddleR);

	this.ball.move();

};

function Ball() {
	//initial ball properties
	this.x =  25;
	this.y =  75;
	this.dx = 2;
	this.dy = 0;
	this.v = 2; //velocity
	this.r = 5; //radius
	this.collisionPadding = 3;
}

Ball.prototype.nextYposition = function() {
	return this.y + this.dy;
};

Ball.prototype.hitTopWall = function() {
	return this.nextYposition() - this.collisionPadding < 0;
};

Ball.prototype.hitBottomWall = function(gameSpace) {
	return this.nextYposition() + this.collisionPadding > gameSpace.height;
};

Ball.prototype.wallCollision = function() {
	this.dy = -this.dy;
};

Ball.prototype.hitLpaddle = function(paddleL) {
	return this.x + this.collisionPadding + this.dx <= paddleL.surface && this.y >= paddleL.yTop && this.y <= paddleL.yBottom();;
};

Ball.prototype.hitRpaddle = function(paddleR) {
	return this.x - this.collisionPadding + this.dx >= paddleR.surface && this.y >= paddleR.yTop && this.y <= paddleR.yBottom();
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
	if (this.hitTopWall()) {
		this.wallCollision();
	} else if (this.hitBottomWall(space)) {
		this.wallCollision();
	} else if (this.hitLpaddle(paddleL)) {
		this.paddleCollision(paddleL);
	} else if (this.hitRpaddle(paddleR)) {
		this.paddleCollision(paddleR);
	}
};


function Paddle(gameSpace, h, w, x, sens) {
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

Paddle.prototype.validDownMove = function(gameSpace) {
	return this.yBottom() <= gameSpace.height;
}






module.exports = Game;










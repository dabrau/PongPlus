function Game(gameInstance) {
	this.gameID = gameInstance;

	this.space = {
		width: 150,
		height: 150
	}

	this.players = {
		self: undefined,
		other: undefined
	}

	this.paddleSpeed = 2; //movement of paddles pixels per frame

	this.ball = {
		//initial ball properties
		x: 25,
		y: 75,
		dx: 2,
		dy: 0,
		v: 2, //velocity
		r: 5, //radius
		collisionPadding: 3,

		// draw: function() {
		//  	gameSpace.ctx.beginPath();
		//  	gameSpace.ctx.arc(this.x, this.y, this.r, 0,Math.PI*2,true); 
		//  	gameSpace.ctx.closePath();
		//  	gameSpace.ctx.fill();
		// },

		nextYposition: function() {
			return this.y + this.dy;
		},

		hitTopWall: function() {
			return this.nextYposition() - this.collisionPadding < 0;
		},

		hitBottomWall: function() {
			return this.nextYposition() + this.collisionPadding > this.space.height;
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
			return this.x < 0 || this.x > this.space.width;
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
	// this.ball.prototype.nextYposition =  function() {
	// 		return this.y + this.dy;
	// 	};
}



module.exports = Game;




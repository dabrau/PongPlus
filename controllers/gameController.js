var gameController = {};
	gameController.getGameSpace = function(canvasID) {
		var canvas = document.getElementById(canvasID);
		gameSpace.width = canvas.width
		gameSpace.height = canvas.height
		gameSpace.ctx = canvas.getContext("2d");
	}

	gameController.initBall = function() {
		ball.x = 40;
		ball.y = gameSpace.height / 2;
		ball.dx = 2;
		ball.dy = 0;
		ball.v = 2;
		ball.r = 5;
	}

	gameController.initPaddleL = function() {
		paddleL = new Paddle(50, 10, 0, 5);
	}

	gameController.initPaddleR = function() {
		paddleR = new Paddle(50, 10, gameSpace.width - 10, 5);
	}

	gameController.init = function() {
		this.getGameSpace("canvas");
		this.initBall();
		this.initPaddleL();
		this.initPaddleR();
	}

	gameController.draw = function() {
		
	}

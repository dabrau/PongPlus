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
		paddleL = new Paddle();
	}

	gameController.initPaddleR = function() {
		paddleR = new Paddle();
	}

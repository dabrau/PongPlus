var gameController = {};
	gameController.getGameSpace = function(canvasID) {
		var canvas = document.getElementById(canvasID);
		gameSpace.width = canvas.width
		gameSpace.height = canvas.height
		gameSpace.ctx = canvas.getContext("2d");
	};

	gameController.initBall = function() {
		ball.x = 40;
		ball.y = gameSpace.height / 2;
		ball.dx = 2;
		ball.dy = 0;
		ball.v = 2;
		ball.r = 5;
		ball.collisionPadding = 3;
	};

	gameController.initPaddleL = function() {
		paddleL = new Paddle(50, 10, 0, 2);
		paddleL.surface = 0 + paddleL.w;
	};

	gameController.initPaddleR = function() {
		paddleR = new Paddle(50, 10, gameSpace.width - 10, 2);
		paddleR.surface = paddleR.x;
	};

	gameController.init = function() {
		this.getGameSpace("canvas");
		this.initBall();
		this.initPaddleL();
		this.initPaddleR();
	};

	gameController.intervalId = undefined;

	gameController.start = function() {
		gameController.init();
		return intervalId = setInterval(gameController.pong, 10);
	};

	gameController.pong = function() {
		gameSpace.clear();
		gameSpace.draw();

		if (paddleR.upKeyPressed && paddleR.validUpMove()) {
			paddleR.moveUp();
		} else if (paddleR.downKeyPressed && paddleR.validDownMove()){
			paddleR.moveDown();
		}

		ball.directionChange();

	  if (ball.out()) {
			clearInterval(intervalId);
		};

		ball.move();
	};

	gameController.gameKeyDown = function(e) {
		if (e.keyCode == 38) {
			paddleR.upKeyPressed = true;
		} else if (e.keyCode == 40) {
			paddleR.downKeyPressed = true;
		}
	};

	gameController.gameKeyUp = function(e) {
		if (e.keyCode == 38) {
			paddleR.upKeyPressed = false;
		} else if (e.keyCode == 40) {
			paddleR.downKeyPressed = false;
		}
	};




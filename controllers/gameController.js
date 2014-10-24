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
		ball.dx = 3;
		ball.dy = 0;
		ball.v = 3;
		ball.r = 5;
		ball.collisionPadding = 3;
	};

	gameController.initPaddleL = function() {
		paddleL = new Paddle(70, 10, 0, 2);
		paddleL.surface = 0 + paddleL.w;
	};

	gameController.initPaddleR = function() {
		paddleR = new Paddle(70, 10, gameSpace.width - 10, 2);
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

		if (paddleL.upKeyPressed && paddleL.validUpMove()) {
			paddleL.moveUp();
		} else if (paddleL.downKeyPressed && paddleL.validDownMove()){
			paddleL.moveDown();
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

		if (e.keyCode == 87) {
			paddleL.upKeyPressed = true;
		} else if (e.keyCode == 83) {
			paddleL.downKeyPressed = true;
		}
	};

	gameController.gameKeyUp = function(e) {
		if (e.keyCode == 38) {
			paddleR.upKeyPressed = false;
		} else if (e.keyCode == 40) {
			paddleR.downKeyPressed = false;
		}

		if (e.keyCode == 87) {
			paddleL.upKeyPressed = false;
		} else if (e.keyCode == 83) {
			paddleL.downKeyPressed = false;
		}
	};

var Cheats = {}
	Cheats.godMode =  function(LorR) {
		if (LorR === 'L') {
			paddleL.yTop = 0;
			paddleL.h = gameSpace.height;
		} else if (LorR === 'R') {
			paddleR.yTop = 0;
			paddleR.h = gameSpace.height;
		}
	}




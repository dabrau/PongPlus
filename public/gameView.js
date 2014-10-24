var gameSpace = {
	height: undefined,
	width: undefined,
	ctx: undefined,
	clear: function() {
	  this.ctx.clearRect(0, 0, this.width, this.height);
	},
	draw: function(x, y, l, r) {
		ball.draw(x, y);
		paddleL.draw(l);
		paddleR.draw(r);
	}
}

var canvas = document.getElementById("canvas");
gameSpace.width = canvas.width
gameSpace.height = canvas.height
gameSpace.ctx = canvas.getContext("2d");

var ball = {
	draw: function(x, y){
	  	gameSpace.ctx.beginPath();
	  	gameSpace.ctx.arc(x, y, 5, 0,Math.PI*2,true); 
	  	gameSpace.ctx.closePath();
	  	gameSpace.ctx.fill();
	}
}

function Paddle(x){
	this.w = 10;
	this.h = 50;
	this.x = x
}

Paddle.prototype.draw = function(y) {
	gameSpace.ctx.fillRect(this.x, y, this.w, this.h);
}

var paddleL = new Paddle();
	paddleL.x = 0;
var paddleR = new Paddle();
	paddleR.x = 140;






// $('.start').on('click', gameController.start);

// $(document).on('keydown',(gameController.gameKeyDown));
// $(document).on('keyup', (gameController.gameKeyUp));
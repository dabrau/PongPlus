var Game = {};
	Game.canvas = document.getElementById('canvas');
	Game.ctx = document.getElementById('canvas').getContext("2d");
	Game.initializeSpace = function(h, w, r, lp, lw, rp, rw) {
			this.canvas.height = h;
			this.canvas.width = w;
			this.ball.radius = r;
			this.LeftPaddle.position = lp;
			this.RightPaddle.position = rp;
			this.LeftPaddle.width = lw;
			this.RightPaddle.width = rw;
	};

	Game.space = {
		clear: function() {
			Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
		},

		draw: function(x, y, l, lh, r, rh) {
			this.clear();
			Game.ball.draw(x, y, Game.ctx);
			Game.LeftPaddle.draw(l, lh, Game.ctx);
			Game.RightPaddle.draw(r, rh, Game.ctx);
		} 
	};

	Game.ball = {
		radius: undefined,

		draw: function(x, y, ctx) {
			ctx.beginPath();
	  	ctx.arc(x, y, this.radius, 0,Math.PI*2,true); 
	  	ctx.closePath();
	  	ctx.fill();
		}
	};

	Game.LeftPaddle = {
		position: undefined, 
		width: undefined,

		draw: function(y, h, ctx) {
			ctx.fillRect(this.position, y, this.width, h);
		}
	};

	Game.RightPaddle = {
		position: undefined, 
		width: undefined,

		draw: function(y, h, ctx) {
			ctx.fillRect(this.position, y, this.width, h);
		}
	};


var userid = undefined;

var socket = io.connect();

socket.on('onconnected', function(data) {
	userid = data.id;
	Game.initializeSpace(
		data.height, 
		data.width, 
		data.radius, 
		data.paddleLPos,
		data.paddleLWidth,
		data.paddleRPos, 
		data.paddleRWidth
	);
});

socket.on('player', function(data) {
	if (userid === data.id && data.p === 'L') {
	} else if (userid === data.id && data.p === 'R') {
		$('.start').show();
	}
});


socket.on('gameState', function(data) {
	console.log(data);
	Game.space.draw(data.x, data.y, data.l, data.lh, data.r, data.rh);
});

$('.initiate').hide();


$('.start').on('click', function () {
	socket.emit('start', {id: userid});
	$(this).hide();
});

$(document).on('keydown', function(e) {
	socket.emit('move', {key: e.keyCode, id: userid})
});

$(document).on('keyup', function(e) {
	socket.emit('stop', {key: e.keyCode, id: userid})
});
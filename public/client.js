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

socket.on('status', function(data) {
	if (userid === data.id && data.status === 'left') {
		$('.status').text("You are Left Paddle!")
	} else if (userid === data.id && data.status === 'right') {
		$('.status').text('You are Right Paddle!')
		$('.start').show();
	} else if (userid === data.id) {
		$('.status').text(data.status + ' waiting ahead of you!')
	}
});


socket.on('gameState', function(data) {
	console.log(data)
	Game.space.draw(data.x, data.y, data.l, data.lh, data.r, data.rh);
});

$('.start').hide();


$('.start').on('click', function () {
	socket.emit('start', {id: userid});
	$(this).hide();
});

$(document).on('keydown', function(e) {
	if (e.keyCode == 38) {
		socket.emit('move up', {id: userid})
	}
	if (e.keyCode == 40) {
		socket.emit('move down', {id: userid})
		console.log("move down")
	}
});

$(document).on('keyup', function(e) {
	if (e.keyCode == 38) {
		socket.emit('stop up', {id: userid})
	}
	if (e.keyCode == 40) {
		socket.emit('stop down', {id: userid})
	}
});



$('.up').on('mousedown', function(e) {
	console.log('it fired up')
		socket.emit('move up', {id: userid})
	}).on('mouseup', function(e) {
		socket.emit('stop up', {id: userid})
	})


$('.down').on('mousedown', function(e) {
	console.log('it fired down')
		socket.emit('move down', {id: userid})
	}).on('mouseup', function(e) {
		socket.emit('stop down', {id: userid})
	});


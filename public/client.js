

var draw = {};

	draw.ctx = document.getElementById('canvas').getContext("2d");

	draw.game = function(x, y, l, r) {
		this.clear();
		this.ball(x, y);
		this.lPaddle(l);
		this.rPaddle(r);
	};

	draw.clear = function() {
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	draw.ball = function(x,y) {
		this.ctx.beginPath();
	  this.ctx.arc(x, y, 5, 0,Math.PI*2,true); 
	  this.ctx.closePath();
	  this.ctx.fill();
	};

	draw.lPaddle = function(y) {
		this.ctx.fillRect(0, y, 10, 50);
	}

	draw.rPaddle = function(y) {
		this.ctx.fillRect(490, y, 10, 50);
	}

var userid = undefined;

var socket = io.connect();

socket.on('onconnected', function(data) {
	userid = data.id;
});

socket.on('gameState', function(data) {
	draw.game(data.x, data.y, data.l, data.r);
});




$('.start').on('click', function () {
	socket.emit('start');
	$(this).hide();

	$(document).on('keydown', function(e) {
		socket.emit('move', {key: e.keyCode, id: userid})
	});

	$(document).on('keyup', function(e) {
		socket.emit('stop', {key: e.keyCode, id: userid})
	});
});



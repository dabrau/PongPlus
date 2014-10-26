

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
		this.ctx.fillRect(140, y, 10, 50);
	}



var socket = io.connect();

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

socket.on('gameState', function(data) {
	console.log(data)
	draw.game(data.x, data.y, data.l, data.r);
});




$('.start').on('click', function () {
	socket.emit('start');

	$(document).on('keydown', function(e) {
		socket.emit('move', {key: e.keyCode})
	});

	$(document).on('keyup', function(e) {
		socket.emit('stop', {key: e.keyCode})
	});
});

console.log(draw.ctx)





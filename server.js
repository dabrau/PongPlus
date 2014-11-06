var express         = require('express');
var UUID            = require('uuid');
var http            = require('http');

var app             = express();
var server          = app.listen(3000);
var io              = require('socket.io')(server);

var game = require('./game.js')

app.use(express.static(__dirname + '/public'));

var currentGame = new game(123);

io.on('connection', function (socket) {
	
	socket.userid = UUID();
	
	socket.emit('onconnected', {id: socket.userid});
	if (currentGame.player.left === undefined) {
		currentGame.player.left = socket.userid;
		socket.emit('player', {id: currentGame.player.left, p: 'L'});
	} else if (currentGame.player.right === undefined) {
		currentGame.player.right = socket.userid;
		socket.emit('player', {id: currentGame.player.right, p: 'R'});
	}

	console.log(currentGame.player.left)
	console.log(currentGame.player.right)

		

	socket.on('start', function() {
		var gameInterval = setInterval(function() {
			currentGame.pong();
			io.emit('gameState', currentGame.state());
			if (currentGame.ball.out(currentGame.space)) {
				currentGame = new game();
				clearInterval(gameInterval);
			}
		}, 16);
	});

	socket.on('move', function (data) {
		if (data.key === 38 && data.id === currentGame.player.left) {
			currentGame.paddleL.upPressed = true;
		}
		if (data.key === 40 && data.id === currentGame.player.left) {
			currentGame.paddleL.downPressed = true;
		}
		if (data.key === 38 && data.id === currentGame.player.right) {
			currentGame.paddleR.upPressed = true;
		}
		if (data.key === 40 && data.id === currentGame.player.right) {
			currentGame.paddleR.downPressed = true;
		}
	});

	socket.on('stop', function (data) {
		if (data.key === 38 && data.id === currentGame.player.left) {
			currentGame.paddleL.upPressed = false;
		}
		if (data.key === 40 && data.id === currentGame.player.left) {
			currentGame.paddleL.downPressed = false;
		}
		if (data.key === 38 && data.id === currentGame.player.right) {
			currentGame.paddleR.upPressed = false;
		}
		if (data.key === 40 && data.id === currentGame.player.right) {
			currentGame.paddleR.downPressed = false;
		}
	});
});



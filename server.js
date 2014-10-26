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

	socket.on('start', function() {
		var gameInterval = setInterval(function() {
			currentGame.pong();
			socket.emit('gameState', currentGame.state());
			if (currentGame.ball.out(currentGame.space)) {
				clearInterval(gameInterval);
			}
		}, 16);
	});

	socket.on('move', function (data) {
		if (data.key === 38) {
		currentGame.paddleL.upPressed = true;
		}
		if (data.key === 40) {
			currentGame.paddleL.downPressed = true;
		}
	});

	socket.on('stop', function (data) {
		if (data.key === 38) {
			currentGame.paddleL.upPressed = false;
		}
		if (data.key === 40) {
			currentGame.paddleL.downPressed = false;
		}
	});
});



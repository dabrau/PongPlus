var express         = require('express');
var UUID            = require('uuid');
var http            = require('http');

var app             = express();
var server          = app.listen(3000);
var io              = require('socket.io')(server);

var game = require('./game.js')
app.use(express.static(__dirname + '/public'));

var currentGame = new game();
var gameInterval = undefined;
var gameQueue = [];

var placePlayer = function(game) {
	game.player.right = gameQueue.shift();
};

var keepWinner = function(game) {
	if (game.ball.x < 0) {
		return game.player.right;
	} else {
		return game.player.left;
	}
};

var placeLoserInQueue = function(game) {
	if (game.ball.x < 0) {
		gameQueue.push(game.player.left);
	} else {
		gameQueue.push(game.player.right);
	}
}

io.on('connection', function (socket) {
	console.log(socket.id)
	socket.userid = UUID();
	
	socket.emit('onconnected', function() {
		data = currentGame.constants();
		data.id = socket.userid;
		return data
	}());

	
	if (currentGame.player.left === undefined) {
		currentGame.player.left = socket.userid;
		socket.emit('player', {id: currentGame.player.left, p: 'L'});
	} else if (currentGame.player.right === undefined) {
		currentGame.player.right = socket.userid;
		socket.emit('player', {id: currentGame.player.right, p: 'R'});
	} else {
		gameQueue.push(socket.userid);
		socket.emit('player', {id: socket.userid, position: gameQueue.indexOf(socket.userid)});
	}

	socket.on('start', function(data) {
		if (data.id === currentGame.player.right) {
			gameInterval = setInterval(function() {
				currentGame.pong();
				io.emit('gameState', currentGame.state());
				if (currentGame.ball.out(currentGame.space)) {
					var winner = keepWinner(currentGame);
					placeLoserInQueue(currentGame);
					currentGame = new game();
					placePlayer(currentGame);
					currentGame.player.left = winner;

					for (var i = 0; i < gameQueue.length; i++) {
						io.emit('player', {id: gameQueue[i], position: i});
					}
					
					
					io.emit('player', {id: currentGame.player.right, p: 'R'});
					io.emit('player', {id: currentGame.player.left, p: 'L'});
					clearInterval(gameInterval);
				}
			}, 16);
		}
	});

	socket.on('disconnect', function() {
		if (this.userid === currentGame.player.left) {
			clearInterval(gameInterval);
			var holder = currentGame.player.right;
			currentGame = new game();
			currentGame.player.left = holder;
			placePlayer(currentGame);

			io.emit('player', {id: currentGame.player.right, p: 'R'})
			io.emit('player', {id: currentGame.player.left, p: 'L'});
			for (var i = 0; i < gameQueue.length; i++) {
				io.emit('player', {id: gameQueue[i], position: i});
			}

		} else if (this.userid === currentGame.player.right) {
			clearInterval(gameInterval);
			var holder = currentGame.player.left;
			currentGame = new game();
			currentGame.player.left = holder;
			placePlayer(currentGame);

			io.emit('player', {id: currentGame.player.right, p: 'R'})
			for (var i = 0; i < gameQueue.length; i++) {
				io.emit('player', {id: gameQueue[i], position: i});
			}
		} else {
			var i = gameQueue.indexOf(this.userid);
			gameQueue.splice(i, 1);
			for (var i = 0; i < gameQueue.length; i++) {
				io.emit('player', {id: gameQueue[i], position: i});
			}
		}		
	})

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

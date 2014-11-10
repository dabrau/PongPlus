var express         = require('express');
var UUID            = require('uuid');
var http            = require('http');

var app             = express();
var server          = app.listen(3000);
var io              = require('socket.io')(server);

var game = require('./game.js')
app.use(express.static(__dirname + '/public'));

var currentGame = new game();

var emitInterval = undefined;
var gameQueue = [];

var setLeftPlayer = function(game, socket) {
	game.player.left = socket.userid;
	socket.emit('status', {id: socket.userid, status: 'left'});
};

var setRightPlayer = function(game, socket) {
	game.player.right = socket.userid;
	socket.emit('status', {id: socket.userid, status: 'right'});
};

var setInQueue = function(queue, id) {
	queue.push(id)
	io.emit('status', {id: id, status: queue.indexOf(id)});
};

var nextPlayer = function(queue) {
	return queue.shift();
}

var setPlayer = function(game, queue, socket) {
	if (!game.player.left) {
		setLeftPlayer(game, socket);
	} else if (!game.player.right) {
		setRightPlayer(game, socket);
	} else {
		setInQueue(queue, socket.userid);
	} 
};

var updatePlayers = function (game, queue) {

	for (var i = 0; i < queue.length; i++) {
		io.emit('status', {id: queue[i], status: i});
	}
	io.emit('status', {id: game.player.left, status: 'left'});
	io.emit('status', {id: game.player.right, status: 'right'});
}


io.on('connection', function (socket) {

	socket.userid = UUID();

	socket.emit('onconnected', function() {
		data = currentGame.constants();
		data.id = socket.userid;
		return data
	}());

	setPlayer(currentGame, gameQueue, socket);

	socket.on('start', function(data) {
		if (data.id === currentGame.player.right) {
			currentGame.start(function(results) {
				clearInterval(emitInterval);
		
				currentGame.reset();
		
				setInQueue(gameQueue, results.loser);
				currentGame.player.left = results.winner;
				currentGame.player.right = nextPlayer(gameQueue);

				updatePlayers(currentGame, gameQueue);
			})
			emitInterval = setInterval(function() {
				io.emit('gameState', currentGame.state());
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

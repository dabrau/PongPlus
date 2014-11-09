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
	socket.emit('status', {id: game.player.left, status: 'left'});
};

var setRightPlayer = function(game, socket) {
	game.player.right = socket.userid;
	socket.emit('status', {id: game.player.right, status: 'right'});
};

var setInQueue = function(queue, socket) {
	queue.push(socket.id)
	socket.emit('player', {id: socket.userid, position: gameQueue.indexOf(socket.userid)});
}

var setPlayer = function(game, socket, queue) {
	if (!game.player.left) {
		setLeftPlayer(game, socket);
	} else if (!game.right) {
		setRightPlayer(currentGame, socket);
	} else {
		setInQueue(queue, socket);
	} 
};


io.on('connection', function (socket) {

	socket.userid = UUID();

	socket.emit('onconnected', function() {
		data = currentGame.constants();
		data.id = socket.userid;
		return data
	}());

	setPlayer(currentGame, socket, gameQueue);


	socket.on('start', function(data) {
		if (data.id === currentGame.player.right) {
			currentGame.start(function(results) {
				clearInterval(emitInterval);
				console.log(results.winner);
				console.log(results.loser);
			})

			emitInterval = setInterval(function() {
				io.emit('gameState', currentGame.state());

				// 	placeLoserInQueue(currentGame);
					// currentGame = new game();
					// placePlayer(currentGame);
					// currentGame.player.left = winner;

					// for (var i = 0; i < gameQueue.length; i++) {
					// 	io.emit('player', {id: gameQueue[i], position: i});
					// }
					
					
					// io.emit('player', {id: currentGame.player.right, p: 'R'});
					// io.emit('player', {id: currentGame.player.left, p: 'L'});
					// clearInterval(emitInterval);
				// }
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

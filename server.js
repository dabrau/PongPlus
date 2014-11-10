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

var removeFromQueue = function(queue, id) {
	var i = queue.indexOf(id);
	queue.splice(i, 1);
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

var updateQueue = function(queue) {
	for (var i = 0; i < queue.length; i++) {
		io.emit('status', {id: queue[i], status: i});
	}
}

var updatePlayers = function(game, queue) {
	io.emit('status', {id: game.player.left, status: 'left'});
	io.emit('status', {id: game.player.right, status: 'right'});
}

var updateAll =  function(game, queue) {
	updateQueue(queue);
	updatePlayers(game, queue);
}

var replaceRightPaddle = function(game, queue) {
	game.player.right = nextPlayer(queue);
	updatePlayers(game, queue);
};

var stopGameDisconnect = function(game) {
	game.stopGame();
	clearInterval(emitInterval)
	game.reset();
}

io.on('connection', function (socket) {
	socket.userid = UUID(); //set connection with an id
	socket.emit('onconnected', function() {
		data = currentGame.constants(); //send id and constants to the client
		data.id = socket.userid;
		return data
	}());
	setPlayer(currentGame, gameQueue, socket); //on connection place the player
	socket.on('start', function(data) {
		if (data.id === currentGame.player.right) {
			currentGame.start(function(results) { //game start takes a callback that has the results as an object
				clearInterval(emitInterval);
				currentGame.reset();
				setInQueue(gameQueue, results.loser);
				currentGame.player.left = results.winner; //winner goes to left paddle and right paddle is replaced
				currentGame.player.right = nextPlayer(gameQueue);
				updateAll(currentGame, gameQueue); //notify the clients of new positions
			})
			emitInterval = setInterval(function() {
				io.emit('gameState', currentGame.state());
			}, 16);
		}
	});

	socket.on('disconnect', function() {
		if (this.userid === currentGame.player.left) {
			var holder = currentGame.player.right;
			stopGameDisconnect(currentGame, gameQueue);
			currentGame.player.left = holder;
			replaceRightPaddle(currentGame, gameQueue);
		} else if (this.userid === currentGame.player.right) {
			var holder = currentGame.player.left;
			stopGameDisconnect(currentGame, gameQueue);
			currentGame.player.left = holder;
			replaceRightPaddle(currentGame, gameQueue);
		} else {
			removeFromQueue(gameQueue, this.userid)
			updateQueue(gameQueue);
		}		
	})

	socket.on('move up', function (data) {
		if (data.id === currentGame.player.left) {
			currentGame.paddleL.upPressed = true;
		}
		if (data.id === currentGame.player.right) {
			currentGame.paddleR.upPressed = true;
		}
	});

	socket.on('move down', function (data) {
		if (data.id === currentGame.player.left) {
			currentGame.paddleL.downPressed = true;
		}
		if (data.id === currentGame.player.right) {
			currentGame.paddleR.downPressed = true;
		}
	})

	socket.on('stop down', function (data) {
		if (data.id === currentGame.player.left) {
			currentGame.paddleL.downPressed = false;
		}
		if (data.id === currentGame.player.right) {
			currentGame.paddleR.downPressed = false;
		}
	});

	socket.on('stop up', function (data) {
		if (data.id === currentGame.player.left) {
			currentGame.paddleL.upPressed = false;
		}
		if (data.id === currentGame.player.right) {
			currentGame.paddleR.upPressed = false;
		}
	})
});

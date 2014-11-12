var express         = require('express');
var UUID            = require('uuid');
var http            = require('http');

var app             = express();
var server          = app.listen(3000);
var io              = require('socket.io')(server);

var game = require('./game.js')
app.use(express.static(__dirname + '/public'));

var currentGame = new game();
var timer;
var emitInterval;
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
};

var setPlayer = function(game, queue, socket) {
	if (!game.player.left) {
		setLeftPlayer(game, socket);
	} else if (!game.player.right) {
		setRightPlayer(game, socket);
		startTimer(game, queue);
	} else {
		setInQueue(queue, socket.userid);
	} 
};

var updateQueue = function(queue) {
	for (var i = 0; i < queue.length; i++) {
		io.emit('status', {id: queue[i], status: i});
	}
};

var updatePlayers = function(game, queue) {
	io.emit('status', {id: game.player.left, status: 'left'});
	io.emit('status', {id: game.player.right, status: 'right'});
};

var updateAll =  function(game, queue) {
	updateQueue(queue);
	updatePlayers(game, queue);
	console.log("clients updated")
};

var replaceRightPaddle = function(game, queue) {
	console.log('right player is being replaced')
	if (game.player.right) { 
		setInQueue(queue, game.player.right)
	} 
	game.player.right = nextPlayer(queue);
	if (game.player.right) { 
		startTimer(game, queue) 
	}
	console.log(game.player.left + " left")
	console.log(game.player.right + " right")
	console.log(queue)
	updateAll(game, queue);
};

var stopGameDisconnect = function(game) {
	game.stopGame();
	clearInterval(emitInterval)
	game.reset();
	clearTimeout(timer)
};

var startTimer = function(game, queue) {
	timer = setTimeout(function() {
		if (!game.inProgress) {
			console.log('right player timed out')
			replaceRightPaddle(game, queue)
		}
	}, 30000)
};

io.on('connection', function (socket) {
	socket.userid = UUID(); //set connection with an id
	console.log(socket.userid + " connected")
	socket.emit('onconnected', function() {
		data = currentGame.constants(); //send id and constants to the client
		data.id = socket.userid;
		return data
	}());

	setPlayer(currentGame, gameQueue, socket); //on connection place the player
	console.log(currentGame.player.right + " right");
	console.log(currentGame.player.left + " left");
	console.log(gameQueue);
	
	socket.on('start', function(data) {
		if (data.id === currentGame.player.right) {
			console.log('game started')
			clearTimeout(timer);
			currentGame.start(function(results) { //game start takes a callback that has the results as an object
				clearInterval(emitInterval); //stop broadcasting the game
				console.log('game ended')
				currentGame.reset();
				setInQueue(gameQueue, results.loser); //move loser to the queue
				currentGame.player.left = results.winner; //winner goes to left paddle and right paddle is replaced
				currentGame.player.right = nextPlayer(gameQueue);
				startTimer(currentGame, gameQueue);
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
			console.log(currentGame.player.left + " disconnected left player")
			stopGameDisconnect(currentGame, gameQueue);
			currentGame.player.left = holder;
			replaceRightPaddle(currentGame, gameQueue);
		} else if (this.userid === currentGame.player.right) {
			var holder = currentGame.player.left;
			console.log(currentGame.player.right + " disconnected right player")
			stopGameDisconnect(currentGame, gameQueue);
			currentGame.player.left = holder;
			replaceRightPaddle(currentGame, gameQueue);
		} else {
			console.log(this.userid + " disconnected from the queue")
			removeFromQueue(gameQueue, this.userid)
			updateQueue(gameQueue);
		}		
	});

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
	});

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

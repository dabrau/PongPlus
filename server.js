// var gameport        = process.env.PORT || 3000;
var io              = require('socket.io');
var express         = require('express');
var UUID            = require('uuid');
var http            = require('http');

var app             = express();
var server          = app.listen(3000);



app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res) {
// 	res.render('index');
// });






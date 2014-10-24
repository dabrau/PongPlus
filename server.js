var gameport        = process.env.PORT || 3000;
var io              = require('socket.io');
var express         = require('express');
var UUID            = require('node-uuid');

var http            = require('http');
var app             = express();
var server          = http.createServer(app);

server.listen(gameport)

app.get( '/', function( req, res ){
        console.log('trying to load %s', __dirname + '/index.html');
        res.sendfile( '/index.html' , { root:__dirname });
    });
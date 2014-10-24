var http = require("http");
var url  = require('url');
var pth  = require('path');
var fs   = require('fs');

// Node.js proxy server for CORS requests with single page, no-backend apps.

var express = require('express');
var app = express();
var server = app.listen(3000);

// Set static assets config here
app.use(express.static(__dirname + '/public'));
// app.set('views', __dirname + '/public/views');
// app.set('view engine', 'ejs');

// app.get('/', function(req, res) {
//   res.render('index');
// });

var io   = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.emit('GS', {'x': 75, 'y': 75, 'l': 25, 'r': 25});
  socket.emit('message', {'message': 'hello world'});
  socket.emit('date', {'date': new Date()});
  setInterval(function() {
    socket.emit('date', {'date': new Date()});
    }, 10000);
  socket.on('client_data', function(data){
    console.log(data.cow);
  });
});






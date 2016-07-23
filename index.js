var express = require ('express');
var app = express ();
var http = require ('http').createServer (app);
var io = require ('socket.io')(http);

io.set('transports', [
    'websocket'
  , 'xhr-polling'
  ]);

app.set ('port', process.env.PORT || 3000);

app.use (express.static (__dirname + '/'));

app.get ('/', getRoot);

function getRoot (req, res) {
  res.send ("Server is running");
}
var user = [];
var ai_room = [];

io.on ('connection', function (socket) {
  socket.on ('Born', function (r_data) {

      var pk_data = {user : r_data ['user'], socketId : socket.id, room : r_data ['room'],
                     cha : r_data ['cha'], pos : r_data ['pos'], rot : r_data ['rot']};

      user.push (pk_data);

      user.forEach (function (item, index, array) {
        console.log (item ['user']);

        if (item ['room'] == r_data ['room'] && item ['user'] != r_data ['user']) {
          var data = {user : item ['user'], cha : item ['cha'],
                      pos : item ['pos'], rot : item ['rot']};

          socket.emit ('Born', data);
        }
      });

      socket.join (r_data ['room']);
      socket.in (r_data ['room']).broadcast.emit ('Born', r_data);
  });

  socket.on ('AI_Born', function (r_data) {
    ai_room [r_data ['room']] = socket.id;
    socket.join (r_data ['room'])
  });

  socket.on ('MoveMent', function (r_data) {
    var room = null;

    user.forEach (function (item, index, array) {
      if (item ['user'] == r_data ['user']) {
        room = item ['room'];
        return;
      }
    });

    socket.broadcast.to (room).emit ('MoveMent', r_data);
  });
});

http.listen (app.get ('port'), function () {
  console.log ("Server is running");
});

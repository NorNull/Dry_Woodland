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
var user = [,];
var ai_room = [];

io.on ('connection', function (socket) {
  socket.on ('Born', function (r_data) {
      for (var index = 0; index < user.length; index++) {
        if (user [index, 'room'] == r_data ['room'] && user [index, 'user'] != r_data ['user']) {
          var data = {user : user [index, 'user'], cha : user [index, 'cha'],
                      pos : user [index, 'pos'], rot : user [index, 'rot']};

          socket.emit ('Born', data);
        }
      }

      user [r_data ['user'], 'socketId'] = socket.id;
      user [r_data ['user'], 'user'] = r_data ['user'];
      user [r_data ['user'], 'cha'] = r_data ['cha'];
      user [r_data ['user'], 'room'] = r_data ['room'];
      user [r_data ['user'], 'pos'] = r_data ['pos'];
      user [r_data ['user'], 'rot'] = r_data ['rot'];

      socket.join (r_data ['room']);
      socket.in (r_data ['room']).broadcast.emit ('Born', r_data);
  });

  socket.on ('AI_Born', function (r_data) {
    ai_room [r_data ['room']] = socket.id;
    socket.join (r_data ['room'])
  });

  socket.on ('MoveMent', function (r_data) {
    socket.in (user [r_data ['user'], 'room']).emit ('MoveMent', r_data);
  });
});

http.listen (app.get ('port'), function () {
  console.log ("Server is running");
});

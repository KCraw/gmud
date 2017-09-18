const server = require('express')();
const http = require('http').Server(server);
const io = require('socket.io')(http);

global.app = require('./src/GameServer')(io);

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// REMOVE THIS CODE
let playerCounter = 1;
io.on('connection', socket => {
  const player = app.new('Player', { short: `Player${playerCounter}` });
  app.io.connect(player.id, socket);
  playerCounter += 1;
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

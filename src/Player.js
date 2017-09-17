/*
  Players are game objects with sockets
 */
const registry = require('./registry');
const GameObject = require('./GameObject');

class Player extends GameObject {
  static lazyload() {
    return null;
  }

  constructor(data, socket = null) {
    super(data.id);
    this.name = data.name;
    this.socket = null;
    this.room = null;
    this.connect(socket);
    this.joinRoom('main');
  }

  willDestruct() {
    this.leaveRoom();
  }

  delete() {
    return false;
  }

  connect(socket) {
    this.socket = socket;
    if (this.socket) {
      this.socket.on('command', msg => {
        // TODO: this goes to command parser
        this.socket.to(this.room).broadcast.emit('message', `${this.name} said, "${msg}"`);
        this.send(`You said, "${msg}"`);
      });
    }
  }

  disconnect() {
    this.socket = null;
  }

  send(msg) {
    if (this.socket) {
      this.socket.emit('message', msg);
    }
  }

  sendRoom(msg) {
    if (this.socket) {
      this.socket.to(this.room).broadcast.emit('message', msg);
    } else {
      registry.get('Room', this.room).sendAll(msg);
    }
  }

  joinRoom(id) {
    this.room = id;
    if (this.socket) {
      this.socket.join(this.room);
    }
    const room = registry.get('Room', this.room);
    this.send(room.description);
    this.send(`Also here: ${room.getPlayerNames().join(', ') || 'nobody'}.`);
    room.addPlayer(this.id);
    this.sendRoom(`${this.name} entered the room.`);
    this.send('You entered the room.');
  }

  leaveRoom() {
    registry.get('Room', this.room).removePlayer(this.id);
    this.room = null;
    this.sendRoom(`${this.name} left the room.`);
    if (this.socket) {
      this.socket.leave(this.room);
    }
  }
}

registry.registerClass(Player.name, Player);
module.exports = Player;

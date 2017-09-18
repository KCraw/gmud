/*
  Players are game objects with sockets
 */
const GameObject = require('./GameObject');

class Player extends GameObject {
  constructor(id, init) {
    super(id, init);
    this.room = init.room;
  }

  onConnect() {
    this.enterRoom(this.room || app.findRoom('/'));
  }

  onDisconnect() {
    app.remove(this.id);
  }

  willRemove() {
    app.save(this.id);
    // Save all my stuff too
    this.leaveRoom();
  }

  willDestroy() {
    this.leaveRoom();
  }

  look(id) {
    return this.short;
  }

  enterRoom(id) {
    this.room = id;
    app.registry.get(this.room).addPlayer(this.id);

    // Move this to command
    app.io.roomsend(this.id, `${this.short} entered the room.`);
  }

  leaveRoom() {
    // Move this to command
    app.io.roomsend(this.id, `${this.short} left the room.`);

    app.registry.get(this.room).removePlayer(this.id);
    this.room = null;
  }
}

module.exports = Player;

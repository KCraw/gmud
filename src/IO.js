class IO {
  constructor(io) {
    this._io = io;
    this._sockets = new Map();
    this._rooms = new Map();
  }

  connect(id, socket) {
    this._sockets.set(id, socket);
    app.registry.get(id).onConnect();
    // TEMP
    socket.on('command', msg => {
      // TODO: this goes to command parser
      this.roomsend(id, `${this.name} said, "${msg}"`);
      this.send(id, `You said, "${msg}"`);
    });
    socket.on('disconnect', () => {
      app.registry.get(id).onDisconnect();
    });
  }

  disconnect(id) {
    this._sockets.get(id).disconnect(true);
    this._sockets.delete(id);
  }

  send(id, msg, key = 'message') {
    this._sockets.get(id).emit(key, msg);
  }

  roomsend(id, msg, key = 'message') {
    this._sockets.get(id).to(this._rooms.get(id)).emit(key, msg);
  }

  roomsendAll(id, msg, key = 'message') {
    this._io.to(this._rooms.get(id)).emit(key, msg);
  }

  join(id, room) {
    this.leave(id);
    this._sockets.get(id).join(room);
    this._rooms.set(id, room);
  }

  leave(id) {
    this._sockets.get(id).leave(this._rooms.get(id));
  }
}

module.exports = IO;


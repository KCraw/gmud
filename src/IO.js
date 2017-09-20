const escapeHtml = require('escape-html');
const ansiHTML = require('ansi-html');

const ansiToHtml = str => {
   return ansiHTML(str).replace(/(\r\n|\n|\r)/g,"<br />");
}

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
      const safeMsg = escapeHtml(msg);
      // TODO: this goes to command parser
      this.roomsend(id, `${app.registry.get(id).short} said, "${safeMsg}"`);
      this.send(id, `You said, "${safeMsg}"`);
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
    this._sockets.get(id).emit(key, ansiToHtml(msg));
  }

  roomsend(id, msg, key = 'message') {
    this._sockets.get(id).to(this._rooms.get(id)).emit(key, ansiToHtml(msg));
  }

  roomsendAll(id, msg, key = 'message') {
    this._io.to(this._rooms.get(id)).emit(key, ansiToHtml(msg));
  }

  join(id, room) {
    this._sockets.get(id).join(room);
    this._rooms.set(id, room);
  }

  leave(id) {
    this._sockets.get(id).leave(this._rooms.get(id));
  }
}

module.exports = IO;

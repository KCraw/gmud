/*
  Rooms are areas that contain players and other objects
 */
const registry = require('./registry');
const GameObject = require('./GameObject');

const db = {
  main: {
    id: 'main',
    description: 'This is the main room. It is very main.'
  }
}

const BindRoom = io => {
  class Room extends GameObject {
    static deserialize(id) {
      return db[id];
    }

    constructor(data) {
      super(data.id);
      this.description = data.description;
      this.players = new Set();
    }

    willDestruct() {
      [...this.players].map(id => registry.get('Player', id)).forEach(player => player.leaveRoom());
    }

    sendAll(msg) {
      io.to(this.id).emit('message', msg);
    }

    addPlayer(id) {
      this.players.add(id);
    }

    removePlayer(id) {
      this.players.delete(id);
    }

    getPlayerNames() {
      return [...this.players].filter(id => registry.has('Player', id)).map(id => registry.get('Player', id).name || 'Anon');
    }
  }
  registry.registerClass(Room.name, Room);
  return Room;
}

module.exports = BindRoom;

/*
  Rooms are areas that contain players and other objects
 */
const GameObject = require('./GameObject');

class Room extends GameObject {
  constructor(id, init) {
    super(id, init);
    this.players = new Set();
  }

  willRemove() {
    this._forceRemovePlayers();
    app.save(this.id);
  }

  willDestroy() {
    this._forceRemovePlayers();
  }

  _forceRemovePlayers() {
    [...this.players].map(id => app.registry.get(id)).forEach(player => player.leaveRoom());
  }

  serialize() {
    const copy = {...this};
    delete copy.players;
    return copy;
  }

  look(id) {
    return `[${this.short}]<br />${this.long}<br />Also here: ${this.getOtherPlayerNames(id).join(', ') || 'nobody'}.`;
  }

  addPlayer(id) {
    this.players.add(id);
    app.io.join(id, this.id);
    app.io.send(id, this.look(id));
  }

  removePlayer(id) {
    app.io.leave(id, this.id);
    this.players.delete(id);
  }

  getPlayerNames() {
    return [...this.players].map(id => app.registry.get(id).short);
  }

  getOtherPlayerNames(pid) {
    return [...this.players].filter(id => pid !== id).map(id => app.registry.get(id).short);
  }
}

Room.lazyload = true;
module.exports = Room;

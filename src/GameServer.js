const EventEmitter = require('events');

const IO = require('./IO');

const ObjectRegistry = require('./ObjectRegistry');
const Player = require('./Player');
const Room = require('./Room');

const fake_db = {
  Room: [
    {
      id: 'main',
      path: '/',
      state: `{
        "short": "Main Room",
        "long": "This is the main room. It is very main."
      }`
    }
  ]
}

class GameServer extends EventEmitter {
  constructor(io) {
    super();
    this.io = new IO(io);
    this.registry = new ObjectRegistry();
    this.registry.registerType(Player);
    this.registry.registerType(Room);
  }

  new(typeName, init) {
    const id = require('crypto').createHash('md5').update(typeName + Math.random()).digest('hex');// insert into datastore and get id
    const type = this.registry.getType(typeName);
    return new type(id, init);
  }

  load(typeName, id) {
    const type = this.registry.getType(typeName);
    const init = JSON.parse(fake_db[typeName].find(obj => obj.id === id).state); // Get this from the datastore
    return new type(id, init);
  }

  save(guid) {
    const obj = this.registry.get(guid);
    this._save(guid, obj.serialize());
  }

  saveAll() {
    this.registry.forEach(obj => this._save(obj.id, obj.serialize()));
  }

  _save(guid, serialized) {
    const data = JSON.stringify(serialized);
    const {type, id} = this.registry.fromGlobalId(guid);
    // Save to datastore
  }

  // Removes an object from the game without deleting it from datastore
  remove(guid) {
    this.registry.get(guid).willRemove();
    this.registry.delete(guid);
  }

  // Removes an object from the game and deletes it from datastore
  destroy(guid) {
    this.registry.get(guid).willDestroy();
    this.registry.delete(guid);
    const {type, id} = this.registry.fromGlobalId(guid);
    // Delete from datastore
  }

  findRoom(path) {
    const data = fake_db[Room.name].find(room => room.path === path);
    return this.registry.toGlobalId(Room.name, data.id);
  }
}

module.exports = io => new GameServer(io);

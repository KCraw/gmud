const crypto = require('crypto');

class ObjectRegistry {
  constructor() {
    this._types = new Map();
    this._guids = new Map();
  }

  toGlobalId(type, id) {
    const unbasedGlobalId = [type, id].join(':');
    return new Buffer(unbasedGlobalId, 'utf8').toString('base64');
  }

  fromGlobalId(guid) {
    const unbasedGlobalId = new Buffer(guid, 'base64').toString('utf8');
    const delimiterPos = unbasedGlobalId.indexOf(':');
    return {
      type: unbasedGlobalId.substring(0, delimiterPos),
      id: unbasedGlobalId.substring(delimiterPos + 1)
    };
  }

  registerType(cls) {
    this._types.set(cls.name, cls);
  }

  getType(typeName) {
    return this._types.get(typeName);
  }

  get(guid) {
    let obj = this._guids.get(guid);
    if (!obj) {
      obj = this._lazyload(guid);
    }
    return obj;
  }

  set(guid, obj) {
    this._guids.set(guid, obj);
  }

  _lazyload(guid) {
    const {type, id} = this.fromGlobalId(guid);
    if (this._types.get(type).lazyload) {
      const obj = app.load(type, id);
      this._guids.set(guid, obj);
      return obj;
    }
  }

  delete(guid) {
    this._guids.delete(guid);
  }

  forEach(fn) {
    new Set(this._guids.values()).forEach(fn);
  }
}

module.exports = ObjectRegistry;

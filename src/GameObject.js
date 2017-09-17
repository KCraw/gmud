const registry = require ('./registry');

class GameObject {
  static deserialize(id) {
    return null;
  }

  static lazyload(id) {
    return this.load(id);
  }

  static load(id) {
    const data = this.deserialize(id);
    if (data) {
      return new this(data);
    }
  }

  constructor(id) {
    this.cl = this.constructor.name;
    this.id = id;
    registry.set(this.cl, this.id, this);
  }

  tick() {
    return null;
  }

  __kill(perm) {
    this.willDestruct(perm);
    registry.destroy(this.cl, this.id);
  }

  destroy() {
    this.__kill(false);
    this.save();
  }

  delete() {
    this.__kill(true);
    // Delete entry from database
  }

  willDestruct() {
    return null;
  }

  serialize() {
    return null;
  }

  save() {
    const data = this.serialize();
    if (data) {
      // Actually save this somehow
    }
  }
}

module.exports = GameObject;

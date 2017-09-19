class GameObject {
  constructor(id, init) {
    this.id = id;
    this.short = init.short;
    this.long = init.long;

    // Register this object for gameserver tick
  }

  serialize() {
    return this;
  }

  willRemove() {
  }

  willDestroy() {
  }

  onTick() {
  }

  look(id) {
    return this.long;
  }
}

GameObject.lazyload = false;
module.exports = GameObject;

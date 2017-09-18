
class GameObject {
  constructor(id, init) {
    this.id = app.registry.toGlobalId(this.constructor.name, id);
    this.short = init.short;
    this.long = init.long;

    app.registry.set(this.id, this);
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

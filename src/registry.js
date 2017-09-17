const registry = new Map();
const everything = new Set();
const classes = new Map();

const forEach = fn => {
  return everything.forEach(fn);
}

const registerClass = (cn, cl) => {
  if (!classes.has(cn)) {
    classes.set(cn, cl);
  }
  if (!registry.has(cn)) {
    registry.set(cn, new Map());
  }
};

const has = (cn, id) => {
  if (!registry.has(cn)) {
    return null;
  }
  return registry.get(cn).has(id);
};

const get = (cn, id) => {
  if (!registry.has(cn)) {
    return null;
  }
  let obj = registry.get(cn).get(id);
  if (!obj && classes.has(cn)) {
    obj = classes.get(cn).lazyload(id);
    set(cn, id, obj);
  }
  return obj;
};

const set = (cn, id, obj) => {
  if(!registry.has(cn)) {
    registry.set(cn, new Map());
  }
  everything.add(obj);
  return registry.get(cn).set(id, obj);
};

const destroy = (cn, id) => {
  if (!registry.has(cn)) {
    return null;
  }
  const store = registry.get(cn);
  const obj = store.get(id);
  everything.delete(obj);
  return store.delete(id);
};

const count = cn => {
  if (!registry.has(cn)) {
    return null;
  }
  return registry.get(cn).size;
};

module.exports = {
  registerClass,
  forEach,
  has,
  get,
  set,
  destroy,
  count,
};

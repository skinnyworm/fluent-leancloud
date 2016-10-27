module.exports = function MemoryStore(initial){
  const data = Object.assign({}, initial);
  return {
    getItem(key){
      return data[key];
    },

    setItem(key,value){
      data[key] = value;
    },

    deleteItem(key){
      delete data[key];
    },
  }
}

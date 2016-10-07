module.exports =()=>{
  const data = {}
  return {
    getItem(key){
      return Promise.resolve(data[key]);
    },

    setItem(key,value){
      data[key] = value;
      return Promise.resolve(true);
    },

    deleteItem(key){
      delete data[key];
      return Promise.resolve(true);
    },
  }
}

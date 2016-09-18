module.exports = ()=>{
  const storeItems = {};
  return {
    getItem: jest.fn((key)=>Promise.resolve(storeItems[key])),
    setItem: jest.fn((key, value)=>{storeItems[key]=value; return Promise.resolve()}),
    deleteItem: jest.fn((key)=>{delete storeItems[key]; return Promise.resolve()})
  };
}

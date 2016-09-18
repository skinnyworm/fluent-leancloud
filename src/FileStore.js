const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = function FileStore(opts={}){

  const getPath = ()=>{
    const filePath = opts.path || path.join(os.homedir(), '.filestore');
    fs.closeSync(fs.openSync(filePath, 'a'));
    return filePath;
  }

  const readData = () => {
    return new Promise((resolve, reject)=>{
      fs.readFile(getPath(), {flag:'r'}, (err, content)=>{
        if(err){
          return reject(err);
        }
        const data=(content && content.length > 0) ? JSON.parse(content) : {};
        return resolve(data);
      });
    });
  }

  const writeData = (data) => {
    const content = JSON.stringify(data);
    return new Promise((resolve, reject)=>{
      fs.writeFile(getPath(), content, {flag:'w'}, (err)=>{
        if(err){
          return reject(err);
        }
        return resolve(true);
      });
    });
  }

  return {
    async getItem(key){
      const data = await readData();
      return data[key];
    },

    async setItem(key,value){
      const data = await readData();
      data[key] = value;
      return await writeData(data);
    },

    async deleteItem(key){
      const data = await readData();
      delete data[key];
      return await writeData(data);
    },
  }
}

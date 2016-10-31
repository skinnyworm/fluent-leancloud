const merge = require('lodash/merge');
const md5 = require('crypto-js/md5');
const md5str = (val)=>md5(val).toString();
const MemoryStore = require('./MemoryStore')
const Http = require('fluent-client/dist/Http');
const Url = require('fluent-client/dist/Url');


const SignRequest = ({appId, appKey, masterKey, store})=> ()=> {
  const sign = (appKey, masterKey)=>{
    const timestamp = Date.now();
    if(masterKey){
      return `${md5str(timestamp + masterKey)},${timestamp},master`
    }else{
      return `${md5str(timestamp + appKey)},${timestamp}`
    }
  }

  return Promise.resolve(store.getItem("@lc-session"))
    .then(accessToken=>{
      const tokenHeader = accessToken ? {'X-LC-Session': accessToken} : {};
      const cfg = {
        headers: merge({
          'X-LC-Id': appId,
          'X-LC-Sign': sign(appKey, masterKey),
        }, tokenHeader)
      };
      return cfg;
    });
}

module.exports = function (opts){
  if(!opts.fetch && typeof(fetch) === 'undefined'){
    throw 'You need to either provide a fetch or use a fetch polyfill.'
  }

  const {appId, appKey, masterKey, country} = opts
  const store  = opts.store || MemoryStore();
  const apiBase = country === 'us' ? 'https://us-api.leancloud.cn/1.1' : 'https://api.leancloud.cn/1.1'
  const http = Http({
    fetch: opts.fetch || fetch,
    url:   Url(apiBase),
    init:  SignRequest({appId, appKey, masterKey, store})
  });
  return Object.assign(http, {store});
}

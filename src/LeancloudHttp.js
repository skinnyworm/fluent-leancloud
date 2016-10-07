const { Http, Url } = require('fluent-client');
const merge = require('lodash/merge');
const isomorphicFetch = require('isomorphic-fetch');
const md5 = require('crypto-js/md5');
const md5str = (val)=>md5(val).toString();

const SignRequest = ({appId, appKey, masterKey, store})=> ()=> {
  const sign = (appKey, masterKey)=>{
    const timestamp = Date.now();
    if(masterKey){
      return `${md5str(timestamp + masterKey)},${timestamp},master`
    }else{
      return `${md5str(timestamp + appKey)},${timestamp}`
    }
  }

  return store.getItem("@lc-session")
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

module.exports = function ({appId, appKey, masterKey, store, country}){
  const apiBase = country === 'us' ? 'https://us-api.leancloud.cn/1.1' : 'https://api.leancloud.cn/1.1'
  return Http({
    url:   Url(apiBase),
    fetch: isomorphicFetch,
    init:  SignRequest({appId, appKey, masterKey, store})
  });
}

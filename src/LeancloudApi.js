const { FluentClient } = require('fluent-client');
const LeancloudHttp = require('./LeancloudHttp');
const MemoStore = require('./MemoStore');
const { resource, userReducer, sms } = require('./templates');

module.exports = ({appId, appKey, masterKey, store, country})=>{

  if(!appId){
    throw 'Must provide an appId'
  }

  if(!(appKey || masterKey)){
    throw 'Must provide an appKey or a masterKey.'
  }

  store = store || MemoStore();

  return FluentClient({
    template: resource,
    http: LeancloudHttp({appId, appKey, masterKey, store, country})
  })
  .define('User', {base: '/users'}, userReducer(store))
  .define('Sms',  sms(store));
}

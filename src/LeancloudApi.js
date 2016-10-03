const {FluentClient} = require('fluent-client');
const LeancloudHttp = require('./LeancloudHttp');
const {resource, UserReducer, SmsReducer} = require('./templates');

module.exports = ({appId, appKey, masterKey, store, country})=>{

  if(!appId){
    throw 'Must provide an appId'
  }

  if(!(appKey || masterKey)){
    throw 'Must provide an appKey or a masterKey.'
  }

  if(!store){
    throw 'Must define a store.'
  }

  return FluentClient({
    template: resource,
    http: LeancloudHttp({appId, appKey, masterKey, store, country})
  })
  .define('User', {base: '/users'}, UserReducer(store))
  //.define('Sms',  {template:{}}, SmsReducer(store));
}

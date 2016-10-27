const ApiFactory = require('fluent-client/dist/ApiFactory');
const { resource, userReducer, sms } = require('./templates');

module.exports = function RestfulClient(http){
  const factory = ApiFactory({http, template:resource});

  const storeSessionToken = (user)=>{
    return Promise.resolve(http.store.setItem('@lc-session', user.sessionToken)).then(()=>user);
  }

  return{
    factory,
    User: factory({base: '/users'}, userReducer(storeSessionToken)),
    Sms: factory({base: '', template: sms(storeSessionToken)}),
  }
}

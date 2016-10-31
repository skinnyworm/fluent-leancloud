const ApiFactory = require('./ApiFactory');
const userTemplate = require('./templates/userTemplate');
const smsTemplate = require('./templates/smsTemplate');

module.exports = function RestfulClient(http){
  const storeSessionToken = (user)=>{
    return Promise.resolve(http.store.setItem('@lc-session', user.sessionToken)).then(()=>user);
  }

  return{
    factory: ApiFactory(http),
    templates:{
      user: userTemplate(storeSessionToken),
      sms: smsTemplate(storeSessionToken)
    }
  }
}

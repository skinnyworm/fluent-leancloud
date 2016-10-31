'use strict';

var ApiFactory = require('./ApiFactory');
var userTemplate = require('./templates/userTemplate');
var smsTemplate = require('./templates/smsTemplate');

module.exports = function RestfulClient(http) {
  var storeSessionToken = function storeSessionToken(user) {
    return Promise.resolve(http.store.setItem('@lc-session', user.sessionToken)).then(function () {
      return user;
    });
  };

  return {
    factory: ApiFactory(http),
    templates: {
      user: userTemplate(storeSessionToken),
      sms: smsTemplate(storeSessionToken)
    }
  };
};
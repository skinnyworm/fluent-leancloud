'use strict';

var ApiFactory = require('fluent-client/dist/ApiFactory');

var _require = require('./templates');

var resource = _require.resource;
var userReducer = _require.userReducer;
var sms = _require.sms;


module.exports = function RestfulClient(http) {
  var factory = ApiFactory({ http: http, template: resource });

  var storeSessionToken = function storeSessionToken(user) {
    return Promise.resolve(http.store.setItem('@lc-session', user.sessionToken)).then(function () {
      return user;
    });
  };

  return {
    factory: factory,
    User: factory({ base: '/users' }, userReducer(storeSessionToken)),
    Sms: factory({ base: '', template: sms(storeSessionToken) })
  };
};
'use strict';

var _require = require('fluent-client');

var FluentClient = _require.FluentClient;

var LeancloudHttp = require('./LeancloudHttp');
var FileStore = require('./FileStore');

var _require2 = require('./templates');

var resource = _require2.resource;
var UserReducer = _require2.UserReducer;
var SmsReducer = _require2.SmsReducer;


module.exports = function (_ref) {
  var appId = _ref.appId;
  var appKey = _ref.appKey;
  var masterKey = _ref.masterKey;
  var store = _ref.store;
  var country = _ref.country;


  if (!appId) {
    throw 'Must provide an appId';
  }

  if (!(appKey || masterKey)) {
    throw 'Must provide an appKey or a masterKey';
  }

  store = store || FileStore();

  return FluentClient({
    template: resource,
    http: LeancloudHttp({ appId: appId, appKey: appKey, masterKey: masterKey, store: store, country: country })
  }).define('User', { location: '/users' }, UserReducer(store));
  //.define('Sms',  {template:{}}, SmsReducer(store));
};
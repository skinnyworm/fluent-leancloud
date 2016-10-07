'use strict';

var _require = require('fluent-client');

var FluentClient = _require.FluentClient;

var LeancloudHttp = require('./LeancloudHttp');
var MemoStore = require('./MemoStore');

var _require2 = require('./templates');

var resource = _require2.resource;
var userReducer = _require2.userReducer;
var sms = _require2.sms;


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
    throw 'Must provide an appKey or a masterKey.';
  }

  store = store || MemoStore();

  return FluentClient({
    template: resource,
    http: LeancloudHttp({ appId: appId, appKey: appKey, masterKey: masterKey, store: store, country: country })
  }).define('User', { base: '/users' }, userReducer(store)).define('Sms', sms(store));
};
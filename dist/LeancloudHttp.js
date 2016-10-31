'use strict';

var merge = require('lodash/merge');
var md5 = require('crypto-js/md5');
var md5str = function md5str(val) {
  return md5(val).toString();
};
var MemoryStore = require('./MemoryStore');
var Http = require('fluent-client/dist/Http');
var Url = require('fluent-client/dist/Url');

var SignRequest = function SignRequest(_ref) {
  var appId = _ref.appId;
  var appKey = _ref.appKey;
  var masterKey = _ref.masterKey;
  var store = _ref.store;
  return function () {
    var sign = function sign(appKey, masterKey) {
      var timestamp = Date.now();
      if (masterKey) {
        return md5str(timestamp + masterKey) + ',' + timestamp + ',master';
      } else {
        return md5str(timestamp + appKey) + ',' + timestamp;
      }
    };

    return Promise.resolve(store.getItem("@lc-session")).then(function (accessToken) {
      var tokenHeader = accessToken ? { 'X-LC-Session': accessToken } : {};
      var cfg = {
        headers: merge({
          'X-LC-Id': appId,
          'X-LC-Sign': sign(appKey, masterKey)
        }, tokenHeader)
      };
      return cfg;
    });
  };
};

module.exports = function (opts) {
  if (!opts.fetch && typeof fetch === 'undefined') {
    throw 'You need to either provide a fetch or use a fetch polyfill.';
  }

  var appId = opts.appId;
  var appKey = opts.appKey;
  var masterKey = opts.masterKey;
  var country = opts.country;

  var store = opts.store || MemoryStore();
  var apiBase = country === 'us' ? 'https://us-api.leancloud.cn/1.1' : 'https://api.leancloud.cn/1.1';
  var http = Http({
    fetch: opts.fetch || fetch,
    url: Url(apiBase),
    init: SignRequest({ appId: appId, appKey: appKey, masterKey: masterKey, store: store })
  });
  return Object.assign(http, { store: store });
};
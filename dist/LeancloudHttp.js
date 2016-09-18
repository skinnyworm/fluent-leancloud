'use strict';

var merge = require('lodash/merge');
var md5 = require('./md5');
var isomorphicFetch = require('isomorphic-fetch');

var _require = require('fluent-client');

var Http = _require.Http;
var Url = _require.Url;


var SignRequest = function SignRequest(_ref) {
  var appId = _ref.appId;
  var appKey = _ref.appKey;
  var masterKey = _ref.masterKey;
  var store = _ref.store;
  return function () {
    var sign = function sign(appKey, masterKey) {
      var timestamp = Date.now();
      if (masterKey) {
        return md5(timestamp + masterKey) + ',' + timestamp + ',master';
      } else {
        return md5(timestamp + appKey) + ',' + timestamp;
      }
    };

    return store.getItem("@lc-session").then(function (accessToken) {
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

module.exports = function (_ref2) {
  var appId = _ref2.appId;
  var appKey = _ref2.appKey;
  var masterKey = _ref2.masterKey;
  var store = _ref2.store;
  var country = _ref2.country;

  var apiBase = country === 'us' ? 'https://us-api.leancloud.cn/1.1' : 'https://api.leancloud.cn/1.1';
  return Http({
    url: Url(apiBase),
    fetch: isomorphicFetch,
    init: SignRequest({ appId: appId, appKey: appKey, masterKey: masterKey, store: store })
  });
};
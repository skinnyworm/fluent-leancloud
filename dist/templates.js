'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var merge = require('lodash/merge');

var resource = function resource() {
  return {
    collection: {
      create: {
        verb: 'post'
      },

      find: {
        args: ['filter'], //'where', 'order', 'limit', 'skip', 'keys'
        verb: 'get',
        params: function params(_ref) {
          var filter = _ref.filter;
          var where = filter.where;

          var other = _objectWithoutProperties(filter, ['where']);

          var params = {};
          if (where) {
            params = { where: JSON.stringify(where) };
          }
          return merge(params, other);
        }
      },

      count: {
        verb: 'get',
        args: ['where'],
        params: function params(_ref2) {
          var where = _ref2.where;

          var params = {};
          if (where) {
            params = { where: JSON.stringify(where) };
          }
          return merge(params, { limit: 0, count: 1 });
        },
        success: function success(response) {
          return response.count;
        }
      }
    },

    instance: {
      get: {
        verb: 'get'
      },
      update: {
        verb: 'put'
      },
      increase: {
        verb: 'put',
        args: ['field', 'amount'],
        data: function data(_ref3) {
          var field = _ref3.field;
          var amount = _ref3.amount;
          return _defineProperty({}, field, { __op: "Increment", amount: amount });
        }
      },
      destroy: {
        verb: 'delete'
      }
    }
  };
};

var UserReducer = function UserReducer(store) {
  return function (user) {
    var storeSessionToken = function storeSessionToken(user) {
      return store.setItem('@lc-session', user.sessionToken).then(function () {
        return user;
      });
    };

    user.collection({
      //me
      me: {
        path: '/me',
        verb: 'get'
      },
      // register and login a user
      create: {
        verb: 'post',
        success: storeSessionToken
      },
      // register or login a user with auth Data
      signUpOrlogInWithAuthData: {
        verb: 'post',
        args: ['data', 'provider'],
        data: function data(_ref5) {
          var _data = _ref5.data;
          var provider = _ref5.provider;

          return {
            authData: _defineProperty({}, provider, _data)
          };
        },
        success: storeSessionToken
      },
      //login
      login: {
        location: '/login',
        verb: 'post',
        success: storeSessionToken
      },
      //请求验证用户邮箱
      requestEmailVerify: {
        location: '/requestEmailVerify',
        verb: 'post',
        args: ['email']
      },
      //请求密码重设
      requestPasswordReset: {
        location: '/requestPasswordReset',
        verb: 'post',
        args: ['email']
      }
    });

    user.instance({
      updatePassword: {
        path: '/updatePassword',
        verb: 'put',
        args: ['old_password', 'new_password']
      },

      connectAuth: {
        verb: 'put',
        args: ['data', 'provider'],
        data: function data(_ref6) {
          var _data2 = _ref6.data;
          var provider = _ref6.provider;
          return {
            authData: _defineProperty({}, provider, _data2)
          };
        }
      },

      disconnectAuth: {
        verb: 'put',
        args: ['provider'],
        data: function data(_ref7) {
          var provider = _ref7.provider;
          return {
            authData: _defineProperty({}, provider, null)
          };
        }
      }

    });
  };
};

// https://leancloud.cn/docs/rest_sms_api.html
var SmsReducer = function SmsReducer(store) {
  return function (sms) {
    sms.collection({
      //请求发送短信验证码
      requestSmsCode: {
        location: '/requestSmsCode',
        verb: 'post',
        args: ['mobilePhoneNumber']
      },

      //验证短信验证码
      verifySmsCode: {
        location: '/verifySmsCode/:code',
        verb: 'post',
        args: ['code']
      },

      //使用手机号码注册或登录
      usersByMobilePhone: {
        location: '/usersByMobilePhone',
        verb: 'post',
        success: function success(user) {
          return store.setItem('@lc-session', user.sessionToken).then(function () {
            return user;
          });
        }
      },

      //请求发送用户手机号码验证短信
      requestMobilePhoneVerify: {
        location: '/requestMobilePhoneVerify',
        verb: 'post',
        args: ['mobilePhoneNumber']
      },

      //使用"验证码"验证用户手机号码
      verifyMobilePhone: {
        location: '/verifyMobilePhone/:code',
        verb: 'post',
        args: ['code']
      },

      //请求发送手机号码登录短信
      requestLoginSmsCode: {
        location: '/requestLoginSmsCode',
        verb: 'post',
        args: ['mobilePhoneNumber']
      },

      //请求发送手机短信验证码重置用户密码
      requestPasswordResetBySmsCode: {
        location: '/requestPasswordResetBySmsCode',
        verb: 'post',
        args: ['mobilePhoneNumber']
      },

      //验证手机短信验证码并重置密码。
      resetPasswordBySmsCode: {
        location: '/requestPasswordResetBySmsCode/:code',
        verb: 'put',
        args: ['code', 'password']
      }
    });
  };
};

module.exports = {
  resource: resource, UserReducer: UserReducer, SmsReducer: SmsReducer
};
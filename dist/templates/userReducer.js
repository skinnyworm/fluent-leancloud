'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
        verb: 'get',
        path: '/me'
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
        data: function data(_ref) {
          var _data = _ref.data;
          var provider = _ref.provider;

          return {
            authData: _defineProperty({}, provider, _data)
          };
        },
        success: storeSessionToken
      },

      //login
      login: {
        verb: 'post',
        base: '/login',
        success: storeSessionToken
      },

      //请求验证用户邮箱
      requestEmailVerify: {
        verb: 'post',
        base: '/requestEmailVerify',
        args: ['email']
      },

      //请求密码重设
      requestPasswordReset: {
        verb: 'post',
        base: '/requestPasswordReset',
        args: ['email']
      }
    });

    user.instance({
      updatePassword: {
        verb: 'put',
        path: '/updatePassword',
        args: ['old_password', 'new_password']
      },

      connectAuth: {
        verb: 'put',
        args: ['data', 'provider'],
        data: function data(_ref2) {
          var id = _ref2.id;
          var _data2 = _ref2.data;
          var provider = _ref2.provider;
          return {
            id: id,
            authData: _defineProperty({}, provider, _data2)
          };
        }
      },

      disconnectAuth: {
        verb: 'put',
        args: ['provider'],
        data: function data(_ref3) {
          var id = _ref3.id;
          var provider = _ref3.provider;
          return {
            id: id,
            authData: _defineProperty({}, provider, null)
          };
        }
      }

    });
  };
};

module.exports = UserReducer;
'use strict';

// https://leancloud.cn/docs/rest_sms_api.html
module.exports = function (storeSessionToken) {
  return {
    collection: {
      //请求发送短信验证码
      requestSmsCode: {
        verb: 'post',
        base: '/requestSmsCode',
        args: ['mobilePhoneNumber']
      },

      //验证短信验证码
      verifySmsCode: {
        verb: 'post',
        base: '/verifySmsCode/:code',
        args: ['code']
      },

      //使用手机号码注册或登录
      registerOrLoginByMobilePhone: {
        verb: 'post',
        base: '/usersByMobilePhone',
        args: ["mobilePhoneNumber", "smsCode", "opts"],
        data: function data(_ref) {
          var mobilePhoneNumber = _ref.mobilePhoneNumber,
              smsCode = _ref.smsCode,
              password = _ref.opts.password;
          return { mobilePhoneNumber: mobilePhoneNumber, smsCode: smsCode, password: password };
        },
        success: storeSessionToken
      },

      //请求发送用户手机号码验证短信
      requestMobilePhoneVerify: {
        verb: 'post',
        base: '/requestMobilePhoneVerify',
        args: ['mobilePhoneNumber']
      },

      //使用"验证码"验证用户手机号码
      verifyMobilePhone: {
        verb: 'post',
        base: '/verifyMobilePhone/:code',
        args: ['code']
      },

      //请求发送手机号码登录短信
      requestLoginSmsCode: {
        verb: 'post',
        base: '/requestLoginSmsCode',
        args: ['mobilePhoneNumber']
      },

      //请求发送手机短信验证码重置用户密码
      requestPasswordResetBySmsCode: {
        verb: 'post',
        base: '/requestPasswordResetBySmsCode',
        args: ['mobilePhoneNumber']
      },

      //验证手机短信验证码并重置密码。
      resetPasswordBySmsCode: {
        verb: 'put',
        base: '/requestPasswordResetBySmsCode/:code',
        args: ['code', 'password']
      }
    }
  };
};
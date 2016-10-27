// https://leancloud.cn/docs/rest_sms_api.html
module.exports = (storeSessionToken)=>{
  return {
    collection:{
      //请求发送短信验证码
      requestSmsCode:{
        verb:'post',
        path: '/requestSmsCode',
        args: ['mobilePhoneNumber']
      },

      //验证短信验证码
      verifySmsCode:{
        verb:'post',
        path: '/verifySmsCode/:code',
        args: ['code'],
      },

      //使用手机号码注册或登录
      usersByMobilePhone:{
        verb: 'post',
        path: '/usersByMobilePhone',
        success: (user)=>{
          return store.setItem('@lc-session', user.sessionToken).then(()=>user);
        }
      },

      //请求发送用户手机号码验证短信
      requestMobilePhoneVerify:{
        verb: 'post',
        path: '/requestMobilePhoneVerify',
        args: ['mobilePhoneNumber']
      },

      //使用"验证码"验证用户手机号码
      verifyMobilePhone: {
        verb: 'post',
        path: '/verifyMobilePhone/:code',
        args: ['code'],
      },

      //请求发送手机号码登录短信
      requestLoginSmsCode:{
        verb: 'post',
        path: '/requestLoginSmsCode',
        args: ['mobilePhoneNumber']
      },

      //请求发送手机短信验证码重置用户密码
      requestPasswordResetBySmsCode:{
        verb: 'post',
        path: '/requestPasswordResetBySmsCode',
        args: ['mobilePhoneNumber']
      },

      //验证手机短信验证码并重置密码。
      resetPasswordBySmsCode:{
        verb: 'put',
        path: '/requestPasswordResetBySmsCode/:code',
        args: ['code','password']
      }
    }
  }
}

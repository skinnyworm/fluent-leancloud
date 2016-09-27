const merge = require('lodash/merge');

const resource = ()=>({
  collection:{
    create:{
      verb: 'post'
    },

    find: {
      args: ['filter'], //'where', 'order', 'limit', 'skip', 'keys'
      verb: 'get',
      params: ({filter})=>{
        const {where, ...other} = filter || {};
        let query = {}
        if(where){
          query = {where: JSON.stringify(where)}
        }
        return merge(query, other);
      },
    },

    count:{
      verb: 'get',
      args: ['where'],
      params: ({where})=>{
        let params = {}
        if(where){
          params = {where: JSON.stringify(where)}
        }
        return merge(params, {limit:0, count:1});
      },
      success:(response)=>response.count
    }
  },

  instance:{
    get:{
      verb: 'get'
    },
    update: {
      verb: 'put'
    },
    increase:{
      verb: 'put',
      args: ['field', 'amount'],
      data: ({field, amount})=>({[field]:{__op:"Increment", amount}})
    },
    destroy:{
      verb: 'delete'
    }
  }
});

const UserReducer =(store)=> (user)=>{
  const storeSessionToken = (user)=>{
    return store.setItem('@lc-session', user.sessionToken).then(()=>user);
  }

  user.collection({
    //me
    me:{
      path: '/me',
      verb: 'get',
    },
    // register and login a user
    create:{
      verb: 'post',
      success: storeSessionToken,
    },
    // register or login a user with auth Data
    signUpOrlogInWithAuthData:{
      verb: 'post',
      args: ['data', 'provider'],
      data: ({data, provider})=>{
        return{
          authData:{
            [provider] : data
          }
        }
      },
      success: storeSessionToken,
    },
    //login
    login:{
      location: '/login',
      verb: 'post',
      success: storeSessionToken,
    },
    //请求验证用户邮箱
    requestEmailVerify:{
      location: '/requestEmailVerify',
      verb: 'post',
      args: ['email'],
    },
    //请求密码重设
    requestPasswordReset:{
      location: '/requestPasswordReset',
      verb: 'post',
      args: ['email']
    },
  });

  user.instance({
    updatePassword: {
      path: '/updatePassword',
      verb: 'put',
      args: ['old_password', 'new_password']
    },

    connectAuth:{
      verb:'put',
      args: ['data', 'provider'],
      data: ({data, provider})=>({
        authData:{
          [provider] : data
        }
      }),
    },

    disconnectAuth:{
      verb:'put',
      args: ['provider'],
      data: ({provider})=>({
        authData:{
          [provider] : null
        }
      }),
    }

  })
}

// https://leancloud.cn/docs/rest_sms_api.html
const SmsReducer = (store)=> (sms)=>{
  sms.collection({
    //请求发送短信验证码
    requestSmsCode:{
      location: '/requestSmsCode',
      verb:'post',
      args: ['mobilePhoneNumber']
    },

    //验证短信验证码
    verifySmsCode:{
      location: '/verifySmsCode/:code',
      verb:'post',
      args: ['code'],
    },

    //使用手机号码注册或登录
    usersByMobilePhone:{
      location: '/usersByMobilePhone',
      verb: 'post',
      success: (user)=>{
        return store.setItem('@lc-session', user.sessionToken).then(()=>user);
      }
    },

    //请求发送用户手机号码验证短信
    requestMobilePhoneVerify:{
      location: '/requestMobilePhoneVerify',
      verb: 'post',
      args: ['mobilePhoneNumber']
    },

    //使用"验证码"验证用户手机号码
    verifyMobilePhone: {
      location: '/verifyMobilePhone/:code',
      verb: 'post',
      args: ['code'],
    },

    //请求发送手机号码登录短信
    requestLoginSmsCode:{
      location: '/requestLoginSmsCode',
      verb: 'post',
      args: ['mobilePhoneNumber']
    },

    //请求发送手机短信验证码重置用户密码
    requestPasswordResetBySmsCode:{
      location: '/requestPasswordResetBySmsCode',
      verb: 'post',
      args: ['mobilePhoneNumber']
    },

    //验证手机短信验证码并重置密码。
    resetPasswordBySmsCode:{
      location: '/requestPasswordResetBySmsCode/:code',
      verb: 'put',
      args: ['code','password']
    }
  });
}

module.exports = {
  resource, UserReducer, SmsReducer
}

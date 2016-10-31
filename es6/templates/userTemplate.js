module.exports = (storeSessionToken)=>({
  collection:{
    //me
    me:{
      verb: 'get',
      path: '/me'
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
      verb: 'post',
      base: '/login',
      success: storeSessionToken,
    },

    //请求验证用户邮箱
    requestEmailVerify:{
      verb: 'post',
      base: '/requestEmailVerify',
      args: ['email'],
    },

    //请求密码重设
    requestPasswordReset:{
      verb: 'post',
      base: '/requestPasswordReset',
      args: ['email']
    },
  },

  instance:{
    updatePassword: {
      verb: 'put',
      path: '/updatePassword',
      args: ['old_password', 'new_password']
    },

    connectAuth:{
      verb:'put',
      args: ['data', 'provider'],
      data: ({id, data, provider})=>({
        id,
        authData:{
          [provider] : data
        }
      }),
    },

    disconnectAuth:{
      verb:'put',
      args: ['provider'],
      data: ({id, provider})=>({
        id,
        authData:{
          [provider] : null
        }
      }),
    }
  }
});

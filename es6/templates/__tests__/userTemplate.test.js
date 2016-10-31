jest.autoMockOff();
jest.mock('../../LeancloudHttp');

const LeancloudHttp = require('../../LeancloudHttp');
const ApiFactory = require('../../ApiFactory');
const userTemplate = require('../userTemplate');

describe("Leancloud User Api", ()=>{
  let User, http, storeSessionToken;

  beforeEach(()=>{
    http = LeancloudHttp({appId:'appid', appKey: 'appKey'});
    const factory = ApiFactory(http)
    storeSessionToken = jest.fn();
    User = factory({type:'_User', template:userTemplate(storeSessionToken)});
  });

  pit('can get current login user', async ()=>{
    await User.me();
    expect(http.argsOf('get')).toEqual(['/users/me', {}]);
  });

  pit('can register', async ()=>{
    http.responseOf('post', {sessionToken:'12345'});
    await User.create({username:'username', password:'password'});

    expect(http.argsOf('post')).toEqual(['/users', {username:'username', password:'password'}]);
    expect(storeSessionToken.mock.calls.length).toEqual(1);
    expect(storeSessionToken.mock.calls[0]).toEqual([{sessionToken:'12345'}]);
  });

  pit('can login', async ()=>{
    http.responseOf('post', {sessionToken:'12345'});
    await User.login({username:'username', password:'password'});

    expect(http.argsOf('post')).toEqual(['/login', {username:'username', password:'password'}]);
    expect(storeSessionToken.mock.calls.length).toEqual(1);
    expect(storeSessionToken.mock.calls[0]).toEqual([{sessionToken:'12345'}]);
  });

  pit('can sign up or login a user with auth data', async ()=>{
    http.responseOf('post', {sessionToken:'12345'});
    const authData = {accessToken:'12345'}
    const provider = 'weibo';
    await User.signUpOrlogInWithAuthData(authData, provider);

    expect(http.argsOf('post')).toEqual(['/users', {
      authData:{
        weibo:{
          accessToken: '12345'
        }
      }
    }]);
    expect(storeSessionToken.mock.calls.length).toEqual(1);
    expect(storeSessionToken.mock.calls[0]).toEqual([{sessionToken:'12345'}]);
  });

  pit('can request verfication email', async ()=>{
    await User.requestEmailVerify('user@example.com');

    expect(http.argsOf('post')).toEqual(['/requestEmailVerify', {email:'user@example.com'}]);
  });

  pit('can request reset password email', async ()=>{
    await User.requestPasswordReset('user@example.com');

    expect(http.argsOf('post')).toEqual(['/requestPasswordReset', {email:'user@example.com'}]);
  });

  pit("can update password", async ()=>{
    await User(1).updatePassword('old', 'new');

    expect(http.argsOf('put')).toEqual(['/users/1/updatePassword', {old_password: 'old', new_password: 'new'}]);
  });

  pit("can connect an existing user with authData of an auth provider", async ()=>{
    const authData = {accessToken:'12345'}
    const provider = 'weibo';

    await User(1).connectAuth(authData, provider);
    expect(http.argsOf('put')).toEqual(['/users/1', {
      authData:{
        weibo: authData
      }
    }]);
  });

  pit("can disconnect an auth provider from an existing user", async ()=>{
    await User(1).disconnectAuth("weibo");
    expect(http.argsOf('put')).toEqual(['/users/1', {
      authData:{
        weibo: null
      }
    }]);
  })

});

jest.autoMockOff();
jest.mock('../LeancloudHttp');
jest.mock('../FileStore');

const MockStore = require('../__mocks__/MockStore');
const LeancloudApi = require('../LeancloudApi');

describe("Leancloud User Api", ()=>{
  let api, http, store;

  beforeEach(()=>{
    store = MockStore();
    api = LeancloudApi({appId:'appid', appKey: 'appKey', store});
    http = api.http;
  });

  pit('can get current login user', async ()=>{
    await api.User.me();

    expect(http.argsOf('get')).toEqual(['/users/me', {}]);
  });

  pit('can register', async ()=>{
    http.responseOf('post', {sessionToken:'12345'});
    expect(await store.getItem('@lc-session')).not.toBeDefined();

    await api.User.create({username:'username', password:'password'});
    expect(http.argsOf('post')).toEqual(['/users', {username:'username', password:'password'}]);
    expect(await store.getItem('@lc-session')).toEqual('12345');
  });

  pit('can login', async ()=>{
    http.responseOf('post', {sessionToken:'12345'});
    expect(await store.getItem('@lc-session')).not.toBeDefined();

    await api.User.login({username:'username', password:'password'});
    expect(http.argsOf('post')).toEqual(['/login', {username:'username', password:'password'}]);
    expect(await store.getItem('@lc-session')).toEqual('12345');
  });

  pit('can sign up or login a user with auth data', async ()=>{
    http.responseOf('post', {sessionToken:'12345'});
    const authData = {accessToken:'12345'}
    const provider = 'weibo';

    expect(await store.getItem('@lc-session')).not.toBeDefined();
    await api.User.signUpOrlogInWithAuthData(authData, provider);

    expect(http.argsOf('post')).toEqual(['/users', {
      authData:{
        weibo:{
          accessToken: '12345'
        }
      }
    }]);
    expect(await store.getItem('@lc-session')).toEqual('12345');
  });

  pit('can request verfication email', async ()=>{
    await api.User.requestEmailVerify('user@example.com');

    expect(http.argsOf('post')).toEqual(['/requestEmailVerify', {email:'user@example.com'}]);
  });

  pit('can request reset password email', async ()=>{
    await api.User.requestPasswordReset('user@example.com');

    expect(http.argsOf('post')).toEqual(['/requestPasswordReset', {email:'user@example.com'}]);
  });

  pit("can update password", async ()=>{
    await api.User(1).updatePassword('old', 'new');

    expect(http.argsOf('put')).toEqual(['/users/1/updatePassword', {old_password: 'old', new_password: 'new'}]);
  });

  pit("can connect an existing user with authData of an auth provider", async ()=>{
    const authData = {accessToken:'12345'}
    const provider = 'weibo';

    await api.User(1).connectAuth(authData, provider);
    expect(http.argsOf('put')).toEqual(['/users/1', {
      authData:{
        weibo: authData
      }
    }]);
  });

  pit("can disconnect an auth provider from an existing user", async ()=>{
    await api.User(1).disconnectAuth("weibo");
    expect(http.argsOf('put')).toEqual(['/users/1', {
      authData:{
        weibo: null
      }
    }]);
  })

});

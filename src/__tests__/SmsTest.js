jest.autoMockOff();
jest.mock('../LeancloudHttp');
const LeancloudApi = require('../LeancloudApi');

describe('Leancloud Sms Api', ()=>{
  let api, http, store;

  beforeEach(()=>{
    store = require('../__mocks__/MockStore')();
    api = LeancloudApi({appId:'appid', appKey: 'appKey', store})
    http = api.http;
  });

  pit('requestSmsCode - 请求发送短信验证码', async ()=>{
    await api.Sms.requestSmsCode("1391111111");
    expect(http.argsOf('post')).toEqual(['/requestSmsCode', {mobilePhoneNumber: "1391111111"}]);
  })

  pit('verifySmsCode - 验证短信验证码', async ()=>{
    await api.Sms.verifySmsCode("12345");
    expect(http.argsOf('post')).toEqual(['/verifySmsCode/12345', {}]);
  });

});

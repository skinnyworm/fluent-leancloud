jest.autoMockOff();
jest.mock('../LeancloudHttp');
const MemoryStore = require('../MemoryStore');
const LeancloudHttp = require('../LeancloudHttp');
const RestfulClient = require('../RestfulClient');

describe('Leancloud Sms Api', ()=>{
  let Sms, http, store;

  beforeEach(()=>{
    http = LeancloudHttp({appId:'appid', appKey: 'appKey'});
    store = MemoryStore();
    http.store = store;
    Sms = RestfulClient(http).Sms
  });

  pit('requestSmsCode - 请求发送短信验证码', async ()=>{
    await Sms.requestSmsCode("1391111111");
    expect(http.argsOf('post')).toEqual(['/requestSmsCode', {mobilePhoneNumber: "1391111111"}]);
  })

  pit('verifySmsCode - 验证短信验证码', async ()=>{
    await Sms.verifySmsCode("12345");
    expect(http.argsOf('post')).toEqual(['/verifySmsCode/12345', {}]);
  });

});

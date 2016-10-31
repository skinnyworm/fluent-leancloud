jest.autoMockOff();
jest.mock('../../LeancloudHttp');

const LeancloudHttp = require('../../LeancloudHttp');
const ApiFactory = require('../../ApiFactory');
const smsTemplate = require('../smsTemplate');

describe('Leancloud Sms Api', ()=>{
  let Sms, http, storeSessionToken;

  beforeEach(()=>{
    http = LeancloudHttp({appId:'appid', appKey: 'appKey'});
    const factory = ApiFactory(http);
    storeSessionToken = jest.fn();
    Sms = factory({type:'_Sms', template:smsTemplate(storeSessionToken)})
  });

  pit('requestSmsCode - 请求发送短信验证码', async ()=>{
    await Sms.requestSmsCode("1391111111");
    expect(http.argsOf('post')).toEqual(['/requestSmsCode', {mobilePhoneNumber: "1391111111"}]);
  })

  pit('verifySmsCode - 验证短信验证码', async ()=>{
    await Sms.verifySmsCode("12345");
    expect(http.argsOf('post')).toEqual(['/verifySmsCode/12345', {}]);
  });

  pit('registerOrLoginByMobilePhone - 使用手机号码注册或登录', async ()=>{
    http.responseOf('post', {sessionToken:'12345'});

    await Sms.registerOrLoginByMobilePhone('1590000000', '1234', {password:'abcd'})
    expect(http.argsOf('post')).toEqual(['/usersByMobilePhone', {
      mobilePhoneNumber: "1590000000",
      smsCode: "1234",
      password: "abcd"
    }]);
    expect(storeSessionToken.mock.calls.length).toEqual(1);
    expect(storeSessionToken.mock.calls[0]).toEqual([{sessionToken:'12345'}]);
  })

});

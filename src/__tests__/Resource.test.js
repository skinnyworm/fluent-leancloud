jest.autoMockOff();
jest.mock('../LeancloudHttp');
const LeancloudApi = require('../LeancloudApi');

describe('Leancloud Api for user defined resources', ()=>{
  let api, http, store;

  beforeEach(()=>{
    store = require('../__mocks__/MockStore')();
    api = LeancloudApi({appId:'appid', appKey: 'appKey', store})
          .define('Project', {base:'/classes/project'});
    http = api.http;
  });


  pit('can find', async ()=>{
    await api.Project.find();
    expect(http.argsOf('get')).toEqual(['/classes/project', {}]);
  });

  pit('can create', async ()=>{
    await api.Project.create({name:'a project'});
    expect(http.argsOf('post')).toEqual(['/classes/project', {name:'a project'}]);
  });

  pit('can count', async ()=>{
    await api.Project.count();
    expect(http.argsOf('get')).toEqual(['/classes/project', {limit:0, count:1}]);
  });

  pit('can get instance', async ()=>{
    await api.Project(1).get();
    expect(http.argsOf('get')).toEqual(['/classes/project/1', {}]);
  });

  pit('can update instance', async ()=>{
    const data = {name: 'project name'}
    await api.Project(1).update(data);
    expect(http.argsOf('put')).toEqual(['/classes/project/1', data]);
  });

  pit('can destroy instance', async ()=>{
    await api.Project(1).destroy();
    expect(http.argsOf('delete')).toEqual(['/classes/project/1', {}]);
  });

  pit('can increase instance field', async ()=>{
    await api.Project(1).increase('viewCount', 2);
    expect(http.argsOf('put')).toEqual(['/classes/project/1', {
      viewCount:{
        __op:'Increment',
        amount: 2
      }
    }]);
  });

})

jest.autoMockOff();
jest.mock('../LeancloudHttp');

const RestfulClient = require('../RestfulClient');
const LeancloudHttp = require('../LeancloudHttp');

describe('Leancloud Api for user defined resources', ()=>{
  let http, factory, Project;

  beforeEach(()=>{
    http = LeancloudHttp({appId:'appid', appKey: 'appKey'});
    factory = RestfulClient(http).factory;
    Project = factory({base:'/classes/project'})
  });

  pit('can find', async ()=>{
    await Project.find();
    expect(http.argsOf('get')).toEqual(['/classes/project', {}]);
  });

  pit('can create', async ()=>{
    await Project.create({name:'a project'});
    expect(http.argsOf('post')).toEqual(['/classes/project', {name:'a project'}]);
  });

  pit('can count', async ()=>{
    await Project.count();
    expect(http.argsOf('get')).toEqual(['/classes/project', {limit:0, count:1}]);
  });

  pit('can get instance', async ()=>{
    await Project(1).get();
    expect(http.argsOf('get')).toEqual(['/classes/project/1', {}]);
  });

  pit('can update instance', async ()=>{
    const data = {name: 'project name'}
    await Project(1).update(data);
    expect(http.argsOf('put')).toEqual(['/classes/project/1', data]);
  });

  pit('can destroy instance', async ()=>{
    await Project(1).destroy();
    expect(http.argsOf('delete')).toEqual(['/classes/project/1', {}]);
  });

  pit('can increase instance field', async ()=>{
    await Project(1).increase('viewCount', 2);
    expect(http.argsOf('put')).toEqual(['/classes/project/1', {
      viewCount:{
        __op:'Increment',
        amount: 2
      }
    }]);
  });

})

jest.autoMockOff();
jest.mock('../LeancloudHttp');

const LeancloudHttp = require('../LeancloudHttp');
const ApiFactory = require('../ApiFactory');

describe('ApiFactory default resource template', ()=>{

  let http, factory, Project;

  beforeEach(()=>{
    http = LeancloudHttp({appId:'appid', appKey: 'appKey'});
    factory = ApiFactory(http);
    Project = factory({type:'Project'})
  });

  pit('can find', async ()=>{
    await Project.find();
    expect(http.argsOf('get')).toEqual(['/classes/Project', {}]);
  });

  pit('can create', async ()=>{
    await Project.create({name:'a project'});
    expect(http.argsOf('post')).toEqual(['/classes/Project', {name:'a project'}]);
  });

  pit('can count', async ()=>{
    await Project.count();
    expect(http.argsOf('get')).toEqual(['/classes/Project', {limit:0, count:1}]);
  });

  pit('can get instance', async ()=>{
    http.responseOf('get', {results: [{objectId:'1'}]});
    await Project(1).get();
    expect(http.argsOf('get')).toEqual(['/classes/Project/1', {}]);
  });

  pit('can update instance', async ()=>{
    const data = {name: 'project name'}
    await Project(1).update(data);
    expect(http.argsOf('put')).toEqual(['/classes/Project/1', data]);
  });

  pit('can destroy instance', async ()=>{
    await Project(1).destroy();
    expect(http.argsOf('delete')).toEqual(['/classes/Project/1', {}]);
  });

  pit('can increase instance field', async ()=>{
    await Project(1).increase('viewCount', 2);
    expect(http.argsOf('put')).toEqual(['/classes/Project/1', {
      viewCount:{
        __op:'Increment',
        amount: 2
      }
    }]);
  });

})

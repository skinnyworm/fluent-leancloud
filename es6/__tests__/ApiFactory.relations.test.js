jest.autoMockOff();
jest.mock('../LeancloudHttp');


const {Pointer} = require('../FieldTypes');
const {Relation} = require('../FieldOps');
const LeancloudHttp = require('../LeancloudHttp');
const ApiFactory = require('../ApiFactory');

describe('ApiFactory relations', ()=>{
  let factory, http;

  beforeEach(()=>{
    http = LeancloudHttp({appId:'appid', appKey: 'appKey'});
    factory = ApiFactory(http);
  });

  describe('belongsTo', ()=>{
    let Comment;
    beforeEach(()=>{
      Comment = factory({type:'Comment'}, (comment)=>{
        comment.belongsTo('post', {type:'Post'})
      });
    });

    it('get', ()=>{
      Comment('1234').post.get();
      expect(http.argsOf('get')).toEqual(['/classes/Comment/1234', {include:'post', keys:'post'}]);
    })

    it('set', ()=>{
      Comment('1234').post.set('4567');
      expect(http.argsOf('put')).toEqual(['/classes/Comment/1234', {post: Pointer('Post')('4567')}]);
    })
  });


  describe('hasMany by pointer', ()=>{
    let Post;

    beforeEach(()=>{
      Post = factory({type:'Post'}, (post)=>{
        post.hasMany('comments', {type:'Comment', foreignKey:'post'})
      });
    });

    it('find', ()=>{
      Post('1234').comments.find()
      expect(http.argsOf('get')).toEqual(['/classes/Comment', {
        where: JSON.stringify({post: Pointer('Post')('1234')})
      }]);
    });

    it('count', ()=>{
      Post('1234').comments.count()
      expect(http.argsOf('get')).toEqual(['/classes/Comment', {
        limit:0,
        count:1,
        where: JSON.stringify({
          post:Pointer('Post')('1234')
        })
      }]);
    });

    it('create', ()=>{
      Post('1234').comments.create({content: "my comments"})
      expect(http.argsOf('post')).toEqual(['/classes/Comment', {
        content:'my comments',
        post:Pointer('Post')('1234')
      }]);
    });
  });

  describe('hasMany by relations', ()=>{
    let Role;
    beforeEach(()=>{
      Role = factory({type:'_Role'}, (role)=>{
        role.hasMany('users', {by:'relations', type:'_User'})
      });
    });

    it('find', ()=>{
      Role('1234').users.find();
      expect(http.argsOf('get')).toEqual(['/users', {
        where: JSON.stringify({$relatedTo: {object:Pointer('_Role')('1234'), key: "users"}})
      }]);
    });

    it('count', ()=>{
      Role('1234').users.count();
      expect(http.argsOf('get')).toEqual(['/users', {
        limit:0,
        count:1,
        where: JSON.stringify({$relatedTo: {object:Pointer('_Role')('1234'), key: "users"}})
      }]);
    });

    it('add', ()=>{
      Role('1234').users.add('5678');
      expect(http.argsOf('put')).toEqual(['/roles/1234', {users: Relation('_User').add('5678')}]);
    });

    it('remove', ()=>{
      Role('1234').users.remove('5678');
      expect(http.argsOf('put')).toEqual(['/roles/1234', {users: Relation('_User').remove('5678')}]);
    });

  })


})

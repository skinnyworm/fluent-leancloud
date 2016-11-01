# Fluent client api for LeanCloud services

[![Build Status](https://travis-ci.org/skinnyworm/fluent-leancloud.svg?branch=master)](https://travis-ci.org/weui/react-weui) [![npm version](https://img.shields.io/npm/v/fluent-leancloud.svg)](https://www.npmjs.org/package/fluent-leancloud)
====

## 简介

fluent-leancloud 用于帮助开发者构建基于 [LeanCloud](http://leancloud.cn) 服务的流畅API。LeanCloud.cn 的云服务提供了足够的后台服务帮助开发者专注于App本身的开发。但是官方客户端SDK的设计上和当下流行的开发方式上有一些不匹配，以至于使用起来有相当的不便。特别是存储部分，由于使用了Data Access Object的模式，使得Data Object维护了大量的内部状态，这个和我们目前项目中所提倡的中的Immutable Data有很大的违和感。 这个项目的目标是希望通过直接调用http restful endpoints实现数据的建模，ORM，用户管理，实时通讯等服务。构建一个简洁，可定制，轻量的开发工具集，特别针对使用React, Flux, Immutable的环境，从而为开发者提供一个官方SDK外的选择。

### 使用场景

fluent-leancloud 并不假设开发者的使用环境，设计初衷是为了构建一个轻量级的工具集，这里从基本用途到ORM建模的路径简单介绍一下三种使用场景。

#### 1. 作为一个简单的HTTP客户端使用

这是最基本的应用场景，fluent-leancloud 提供了一个基于fetch的HTTP client，这个客户端封装了[LeanCloud的鉴权方法](https://leancloud.cn/docs/rest_api.html#更安全的鉴权方式)，让开发者直接使用http的(get | put | post | delete)方法访问Leancloud服务而不用关心请求头中 **X-LC-Id**, **X-LC-Sign**, **X-LC-Session** 构建方法。

```javascript
//Node环境下必须提供一个fetch polyfil
import 'whatwg-fetch';
import {LeancloudHttp} from 'fluent-leancloud';

// 创建一个Http client
const http = LeancloudHttp({
  appId: "应用appId",
  appKey: '应用appKey',
  masterKey: '应用masterKey,可选是可选项'
})

// 获取app信息
http.get('/stats/appinfo').then(console.log, console.error);

// 创建一条Todo记录
http.post('/classes/Todo', {content:"演示TODO", completed:false}).then(console.log, console.error);

// 修改Todo记录
http.put('/classes/Todo/57e5c7b78ac247005bc28e82', {completed:true}).then(console.log, console.error);

// 删除Todo记录
http.delete('/classes/Todo/57e5c7b78ac247005bc28e82').then(console.log, console.error);

```
这里需要注意的是，由于LeancloudHttp是基于**fetch api**的，所以在没有fetch的环境（例如Node）中使用时，需要require一个fetch的polyfill。github的 **[whatwg-fetch](https://github.com/github/fetch)** 是个不错的选择。

#### 2. 作为API封装工具，让开发者使用流畅API来访问Leancloud的服务
使用LeancloudHttp虽然可以很方便地使用 GET | POST | PUT | DELETE 方法调用LeanCloud的RESTFUL API，但是还是需要写很多代码。所以在LeancloudHttp的基础上我们提供了一种基于模版声明的方法帮助开发者定义API。这是fluent-leancloud和官方SDK最大的区别。我个人认为Declarative的编程方式比Imperative编程方法能够更方便简洁地描述API。

>Declarative programming is “the act of programming in languages that conform to the mental model of the developer rather than the operational model of the machine”.

以LeanCloud的存储服务为例，所有的数据表都提供了相同的CRUD操作方法，所以我们可以定义一个[resource](https://github.com/skinnyworm/fluent-leancloud/blob/master/es6/templates/resource.js)模版来描述这些方法。而不用每次显性地呼叫操作流程来完成操作。事实上, fluent-leancloud所有的api方法都是通过模版的方式定义的，用户的自定义方法也是通reduce已有模版完成。

还是以Http Client中的Todo为例子

```javascript
//Node环境下必须提供一个fetch polyfil
import 'whatwg-fetch';
import {LeancloudHttp} from 'fluent-leancloud';

// 创建一个Http client, 和之前示例一致，此处省略...
const http = ...

// 创建 API factory
const {factory} = LeancloudApi(http)

// 创建 Todo Api Object.
const Todo = factory({type: 'Todo'})


// --------------------
//    Collection 方法
// --------------------

// 创建一条Todo
Todo.create({content: "演示TODO", completed:false}).then(console.log, console.error);

// 查找Todo
Todo.find({where: {completed: false}, limit:2, order:'createdAt'}).then(console.log, console.error);

// 查找第一条满足条件的记录
Todo.findOne({where: {completed: false}}).then(console.log, console.error);

// 计数
Todo.count().then(console.log, console.error);

// --------------------
//    Instance 方法
// --------------------
// 实例的objectId
const objectId="5811e206a0bb9f0061e22250";

// 获取Todo的数据实例
Todo(objectId).get().then(console.log, console.error);

// 更新Todo的数据实例
Todo(objectId).update({completed: true}).then(console.log, console.error)

// 将Todo的viewCount字段加2
Todo(objectId).increase('viewCount', 2).then(console.log, console.error);

// 删除Todo的数据实例
Todo(objectId).destroy().then(console.log, console.error);
```

通过LeancloudApi方法，我们将一个http client封装成一个factory方法，这个factory方法被用于创建应用的Api Object。默认情况下，factory方法使用[resource](https://github.com/skinnyworm/fluent-leancloud/blob/master/es6/templates/resource.js)模版构建一个Api对象。通过这个Api对象我们可以使用流畅Api的方式操作数据表。这些操作被分成两类。

1. Collection方法是针对整个数据表的操作，包括(create, find, findOne 和 count)。 调用方法类似于static方法，例如 `Todo.create(data)`
2. Instance方法是针对某个数据项的操作，包括(get, update, destroy 和 increase)。调用方法为函数链接，例如 `Todo(id).update(data)`

我们可以基于内建模版增添新的方法函数，或者彻底使用其它模版构建方法函数。下面就是增添自定义方法的示例，在这个场景中，我们希望通过实例方法为一个Todo添加标签。

```javascript
//Node环境下必须提供一个fetch polyfil
import 'whatwg-fetch';

// 导入 LeancloudHttp, LeancloudApi
import {LeancloudHttp, LeancloudApi} from 'fluent-leancloud';

// 导入Array操作
import {Array} from 'fluent-leancloud/dist/FieldOps';

// 创建一个Http client, 和之前示例一致，此处省略...
const http = ...

// 创建 API factory
const {factory} = LeancloudApi(http);

// 创建 Todo Api Object
const Todo = factory({type: 'Todo'}, (todo)=>{
  // 在instance上声明定制的addTags方法
  todo.instance({
    addTags:{
      verb: 'put',
      args: ['labels'],
      data: ({id, labels})=>({id, tags: Array.addUnique(labels)})
    }
  })
})

// --------------------
//  instance 方法
// --------------------
// 实例的objectId
const objectId="5811e206a0bb9f0061e22250";

// 为Todo数据项的tags字段添加一个‘work’标签
Todo(objectId).addTags(['work','programming']).then(console.log, console.error);
```

#### 3. 作为ORM数据建模工具使用，同样使用流畅API降低使用时的学习成本

对于复杂一些的数据结构，fluent-leancloud提供了ORM的工具，方便开发者声明数据间的关系。目前提供了常用的**blongsTo**和**hasMany**的关系声明，由于LeanCloud的储存服务提供Pointer和Relation两种数据类型。按照官方的说明，我们默认使用Pointer来定义one to many的关系，用Relation来定义many to many的关系。

##### HasMany by pointer 和 BelongsTo 关系
在此先以Post和Comment为例，它们间的关系如官方文档中描述的一致，我们在Comment数据表上添加了post字段，这个字段的类型为Pointer指向一个Post

```javascript
//Node环境下必须提供一个fetch polyfil
import 'whatwg-fetch';

// 导入 LeancloudHttp, LeancloudApi
import {LeancloudHttp, LeancloudApi} from 'fluent-leancloud';

// 创建一个Http client, 和之前示例一致，此处省略...
const http = ...

// 创建 API factory
const {factory} = LeancloudApi(http)

// 创建 Post Api Object.
const Post = factory({type: 'Post'}, (post)=>{
  // Post hasMany comments by pointer via comments relation
  post.hasMany('comments', {type:'Comment', by:'pointer', foreignKey:'post'})
});

// 创建 Comment Api Object.
const Comment = factory({type: 'Comment'}, (comment)=>{
  // Comment belongs to Post via post relation
  comment.belongsTo('post', {type:'Post'})
});

// 创建一条Post记录
Post.create({title:'Test'}).then(console.log, console.error);

// fake post id
const postId = "5817091567f3560058686e00";
//--------------------------------------------------
// Post(postId).comments 是个 hasMany by pointer 关系
// 这个关系有create, find, count方法
//--------------------------------------------------

// 创建一条Post的Comment记录，Comment的post字段会包含指向这个Post的指针
Post(postId).comments.create({content:"it is good"}).then(console.log, console.error);

// 查找这个Post的所有Comment记录
Post(postId).comments.find({order:"createdAt"}).then(console.log, console.error);

// 这个Post的comments总数
Post(postId).comments.count().then(console.log, console.error);


// fake comment id
const commentId = "581709658ac247004fbf50c5"
//--------------------------------------------------
// Comment(commentId).post 是个 belongsTo 关系
// 这个关系有get, set方法
//--------------------------------------------------

// 设置这条Comment的Post
Comment(commentId).post.set('5817091567f3560058686e00').then(console.log, console.error)

// 获得这条Comment的Post数据
Comment(commentId).post.get().then(console.log, console.error)

```

- hasMany by pointer关系定义了3个方法，分别是 `find`, `count`, `create`
- belongsTo关系定义了2个方法，分别是 `get`, `set` 用于设定Pointer


##### HasMany by relation 关系

除了使用Pointer外，我们还可以使用LeanCloud提供的Relation作为构建hasMany关系的方法。以LeanCloud内建的Role为列，它包含了两个relations，一个是users, 一个是roles。

我们可以这样定义:

```javascript
...
// 创建 API factory
const {factory} = LeancloudApi(http)

// 定义 Role Api
const Role = factory({type:'_Role'}, role=>{
  role.hasMany('users', {type: '_User', by: 'relations'});
  role.hasMany('roles', {type: '_Role', by: 'relations'});
})
```

使用示例:

```javascript
...
async function seedRolesExample(){
  // 创建 admin role
  const {objectId: admin} = await Role.create({name:'admin', ACL:{"*":{read: true}}});
  // 创建 manager role
  const {objectId: manager} = await Role.create({name:'manager', ACL:{"*":{read: true}}});
  // 将 manager role 添加到 admin roles
  await Role(admin).roles.add(manager);

  return {admin, manager}
}


async function userRelationExamples(roleId, userId){
  // 将用户添加到一个Role中
  await Role(roleId).users.add(userId);
  // 将用户从一个Role中移除
  await Role(roleId).users.remove(userId);
  // 查询一个Role下的所有用户
  await Role(roleId).users.find({where:{verified:false}});
  // 查询一个Role下的所有用户数量
  await Role(roleId).users.count();
}

// 执行 seedRolesExample
seedRolesExample().then(console.log, console.error)
```

这上面的示例中我们定义了一个hasMany by relations的关系，定义方法为 `role.hasMany('users', {type: '_User', by: 'relations'});`。 目前hasMany by relations关系定义了4个方法，分别是 `find`, `count`, `add`, `remove`

我们会根据需要在后续的版本中加入hasMany by through的关系，用于描述多对多关系中的另一边，在_Role这个场景中，我们可以在_User端定义`user.hasMany('roles', {type:'_Role', by: 'through'})`的关系。

需要注意的是我们用下划线来表明LeanCloud内部的数据表，比如_User和_Role。


 ## 最佳实践 Best Practice

 ### 关于Store (MemoryStore, FileStore, SessionStore)

 (补充文档)

 ### Node Express 和 KOA 整合

 (补充文档)

 ### React Redux Flux 整合

 (补充文档)

 ### React Native 注意事项

 (补充文档)


 ## 内建模型

 ### User

 (补充文档)

 ### Sms

 (补充文档)

 ### Push

 (补充文档)

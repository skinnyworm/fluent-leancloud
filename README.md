### Usage

Examples:

```javascript
# code in ES6

const appId = "app id"
const appKey = "app key"
const masterKey= 'app master key' // optional
const store = aStore // If not set, it will use default FileStore

// initialize api with app key and app id
const api = require('fluent-leancloud')({appId, appKey, masterKey, store});

// define a new resource with default template.
api.define('Project', {location:'/classes/Project'});


const AsyncUsage = async ()=>{

  // Create
  // POST /1.1/classes/Project
  // return created object with objectId
  const project = {name: 'A project'}
  const result = await api.Project.create(project);

  // Find
  // GET /1.1/classes/Project
  // return a list of projects
  const filter = {where:{completed: false}, limit:10, order:'createdAt'}
  const projects = await api.Project.find(filter);

  // Count
  // GET /1.1/classes/Project
  // return a number
  const count = await api.Project.count({completed: false});

  // Get an instance
  // GET /1.1/classes/Project/1234
  // return a project instance
  const project = await api.Project('1234').get();

  // Update an instance
  // PUT /1.1/classes/Project/1234
  // return updated project.
  const project = await api.Project('1234').update({name: 'new name', completed:true});

  // Delete an instance
  // DELETE /1.1/classes/Project/1234
  // return nothing upon success
  await api.Project('1234').destroy();

  // Atomic increase numeric field of an instance
  // PUT /1.1/classes/Project/1234
  await api.Project('1234').increase('viewCount', 1);

}

const PromiseUsage = ()=>{
  const project = {name: 'A project'}
  api.Project.create(project).then(console.log, console.error);
  ...
}

```

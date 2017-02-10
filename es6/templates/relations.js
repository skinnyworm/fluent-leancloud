const {pathOf, Pointer} = require('../FieldTypes');
const {Relation} = require('../FieldOps');

const filterToParams = require('./filterToParams');
const merge = require('lodash/merge');

const belongsTo = ({type, foreignType, key})=>{
  if(type && foreignType && key){
    return{
      instance:{
        get:{
          verb: 'get',
          path: '/:id',
          data: ({id})=>({id, include:key, keys:key}),
          success:(result)=> result[key]
        },
        set:{
          verb: 'put',
          path: '/:id',
          args: ["foreignId"],
          data: ({id, foreignId})=>({id, [key]: Pointer(foreignType)(foreignId)})
        }
      }
    }

  }else{
    throw "You must provide key, type, foreignType and foreignKey when define a belongsTo relation";
  }
}

const hasMany = ({type, foreignType, key, foreignKey})=> {
  if(type && foreignType && key && foreignKey){
    //TODO:: vaidate type, foreignType, key and foreignKey
    return{
      collection: {
        find: {
          verb: 'get',
          args: ['filter'],
          base: pathOf(foreignType),
          params: ({filter, id, relation, relationIds})=> {
            filter = merge(filter, {where:{[foreignKey]: Pointer(type)(id)}});
            return filterToParams(filter);
          },
          success:(response)=>response
        },

        count:{
          verb: 'get',
          args: ['filter'],
          base: pathOf(foreignType),
          params: ({filter, id, relation, relationIds})=>{
            filter = merge(filter, {where:{[foreignKey]: Pointer(type)(id)}, limit:0, count:1});
            return filterToParams(filter);
          },
          success:(response)=>response.count
        },

        create: {
          verb: 'post',
          args:['data'],
          base: pathOf(foreignType),
          data: ({data, id, relations, relationIds})=>{
            return Object.assign(data, {[foreignKey]:Pointer(type)(id)});
          }
        },
      }
    }
  }else{
    throw "Your must provide key, type, foreignType and foreignKey when define a hasMany relation";
  }
}

const hasManyByRelation = ({type, foreignType, key})=> {
  if(type && foreignType && key){
    //TODO:: vaidate type, foreignType and key
    return{
      collection: {
        find: {
          verb: 'get',
          args:['filter'],
          base: pathOf(foreignType),
          data: ({filter, id})=>{
            filter = merge(filter, {where:{$relatedTo: {object: Pointer(type)(id), key}}});
            return filterToParams(filter);
          },
          success:(response)=>response
        },

        count: {
          verb: 'get',
          args:['filter'],
          base: pathOf(foreignType),
          data: ({filter, id})=>{
            filter = merge(filter, {where:{$relatedTo: {object: Pointer(type)(id), key}}, limit:0, count:1});
            return filterToParams(filter);
          },
          success:(response)=>response.count
        },

        add: {
          verb: 'put',
          args:['ids'],
          path: '/:id',
          data: ({ids, id})=>({id, [key]:Relation(foreignType).add(ids)})
        },

        remove: {
          verb: 'put',
          args:['ids'],
          path: '/:id',
          data: ({ids, id})=>({id, [key]:Relation(foreignType).remove(ids)})
        }
      }
    }
  }else{
    throw "Your must provide key, type and foreignType when define a hasManyByRelation relation";
  }
};

module.exports = {
  belongsTo, hasMany, hasManyByRelation
}

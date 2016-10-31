const merge = require('lodash/merge');
const createApi = require('fluent-client/dist/createApi');
const {pathOf} = require('./FieldTypes');
const resource = require('./templates/resource');
const {hasMany, hasManyByRelation, belongsTo} = require('./templates/relations')


const reduceTemplate = (initial, type, reduceFn)=>{
  let template = (typeof(initial) === 'function') ? initial() : initial;
  if(!reduceFn){
    return template;
  }

  const reducers = {
    instance(methods){
      template = merge({}, template, {instance: methods})
    },

    collection(methods){
      template = merge({}, template, {collection: methods})
    },

    belongsTo: (key, {type:foreignType})=>{
      if(!foreignType){
        throw "Must specify the 'type' in a belongsTo relation."
      }

      template = merge({}, template, {relations: {
        one:{
          [key]: belongsTo({key, type, foreignType})
        }
      }});
    },

    hasMany: (key, {by, type:foreignType, foreignKey})=>{
      if(!foreignType){
        throw "Must specify the 'type' in a hasMany relation."
      }

      let many;
      switch(by){
        case "relations":
          many = {[key]: hasManyByRelation({type, foreignType, key})}
          break;

        default:
          if(!foreignKey){
            throw "Must specify the 'foreignKey' when use hasMany by pointer relation."
          }
          // default is by pointer
          many = {[key]: hasMany({type, foreignType, key, foreignKey})}
      }
      template = merge({}, template, {relations: { many}});
    }
  }

  reduceFn(reducers);
  return template;
}


module.exports = function ApiFactory(http){
  return ({type, template}, reduceFn)=> {
    const initial = template || resource;
    return createApi({http, base:pathOf(type), template: reduceTemplate(initial, type, reduceFn)});
  }
}

import merge from 'lodash/merge';

const filterToParams = (filter)=>{
  //filter has keys like 'where', 'order', 'limit', 'skip', 'keys'
  const {where, ...other} = filter || {};
  return where ? merge({where: JSON.stringify(where)}, other) : other;
}

module.exports = ()=>({
  restPath: true,

  collection:{
    // Create resource
    create:{
      verb: 'post'
    },

    // find resources
    find: {
      args: ['filter'],
      verb: 'get',
      params: ({filter})=>filterToParams(filter),
      success:(response)=>response.results
    },

    findOne:{
      args: ['filter'], //'where', 'order', 'limit', 'skip', 'keys'
      verb: 'get',
      params: ({filter})=>merge(filterToParams(filter), {limit:1}),
      success:(response)=>response.results.length === 0 ? null : response.results[0]
    },

    count:{
      verb: 'get',
      args: ['where'],
      params: ({filter})=>merge(filterToParams(filter), {limit:0, count:1}),
      success:(response)=>response.count
    }
  },

  instance:{
    get:{
      verb: 'get'
    },

    update: {
      verb: 'put'
    },

    increase:{
      verb: 'put',
      args: ['field', 'amount'],
      data: ({id, field, amount})=>({id, [field]:{__op:"Increment", amount}})
    },

    destroy:{
      verb: 'delete'
    }
  }
});

const merge = require('lodash/merge');
const buildRestPath = require('./buildRestPath')
const filterToParams = require('./filterToParams');
const {Count} = require('../FieldOps');

module.exports = ()=>({
  config: {
    buildPathTemplate: buildRestPath,
  },

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
      args: ['filter'],
      params: ({filter})=>merge(filterToParams(filter), {limit:0, count:1}),
      success:(response)=>response.count
    }
  },

  instance:{
    get:{
      verb: 'get',
    },

    update: {
      verb: 'put'
    },

    increase:{
      verb: 'put',
      args: ['field', 'amount'],
      data: ({id, field, amount})=>({id, [field]: Count.increase(amount)})
    },

    destroy:{
      verb: 'delete'
    }
  }
});

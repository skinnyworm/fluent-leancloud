const merge = require('lodash/merge');

module.exports = function filterToParams(filter){
  //filter has keys like 'where', 'order', 'limit', 'skip', 'keys'
  const {where, ...other} = filter || {};
  return where ? merge({where: JSON.stringify(where)}, other) : other;
}

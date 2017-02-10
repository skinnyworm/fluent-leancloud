'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var merge = require('lodash/merge');

module.exports = function filterToParams(filter) {
  //filter has keys like 'where', 'order', 'limit', 'skip', 'keys'
  var _ref = filter || {},
      where = _ref.where,
      other = _objectWithoutProperties(_ref, ['where']);

  return where ? merge({ where: JSON.stringify(where) }, other) : other;
};
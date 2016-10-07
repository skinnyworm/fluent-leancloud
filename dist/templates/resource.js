'use strict';

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var filterToParams = function filterToParams(filter) {
  //filter has keys like 'where', 'order', 'limit', 'skip', 'keys'
  var _ref = filter || {};

  var where = _ref.where;

  var other = _objectWithoutProperties(_ref, ['where']);

  return where ? (0, _merge2.default)({ where: JSON.stringify(where) }, other) : other;
};

module.exports = function () {
  return {
    restPath: true,

    collection: {
      // Create resource
      create: {
        verb: 'post'
      },

      // find resources
      find: {
        args: ['filter'],
        verb: 'get',
        params: function params(_ref2) {
          var filter = _ref2.filter;
          return filterToParams(filter);
        },
        success: function success(response) {
          return response.results;
        }
      },

      findOne: {
        args: ['filter'], //'where', 'order', 'limit', 'skip', 'keys'
        verb: 'get',
        params: function params(_ref3) {
          var filter = _ref3.filter;
          return (0, _merge2.default)(filterToParams(filter), { limit: 1 });
        },
        success: function success(response) {
          return response.results.length === 0 ? null : response.results[0];
        }
      },

      count: {
        verb: 'get',
        args: ['where'],
        params: function params(_ref4) {
          var filter = _ref4.filter;
          return (0, _merge2.default)(filterToParams(filter), { limit: 0, count: 1 });
        },
        success: function success(response) {
          return response.count;
        }
      }
    },

    instance: {
      get: {
        verb: 'get'
      },

      update: {
        verb: 'put'
      },

      increase: {
        verb: 'put',
        args: ['field', 'amount'],
        data: function data(_ref5) {
          var id = _ref5.id;
          var field = _ref5.field;
          var amount = _ref5.amount;
          return _defineProperty({ id: id }, field, { __op: "Increment", amount: amount });
        }
      },

      destroy: {
        verb: 'delete'
      }
    }
  };
};
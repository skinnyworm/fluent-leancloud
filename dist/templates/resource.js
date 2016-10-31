'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var merge = require('lodash/merge');
var buildRestPath = require('./buildRestPath');
var filterToParams = require('./filterToParams');

var _require = require('../FieldOps');

var Count = _require.Count;


module.exports = function () {
  return {
    config: {
      buildPathTemplate: buildRestPath
    },

    collection: {
      // Create resource
      create: {
        verb: 'post'
      },

      // find resources
      find: {
        args: ['filter'],
        verb: 'get',
        params: function params(_ref) {
          var filter = _ref.filter;
          return filterToParams(filter);
        },
        success: function success(response) {
          return response.results;
        }
      },

      findOne: {
        args: ['filter'], //'where', 'order', 'limit', 'skip', 'keys'
        verb: 'get',
        params: function params(_ref2) {
          var filter = _ref2.filter;
          return merge(filterToParams(filter), { limit: 1 });
        },
        success: function success(response) {
          return response.results.length === 0 ? null : response.results[0];
        }
      },

      count: {
        verb: 'get',
        args: ['filter'],
        params: function params(_ref3) {
          var filter = _ref3.filter;
          return merge(filterToParams(filter), { limit: 0, count: 1 });
        },
        success: function success(response) {
          return response.count;
        }
      }
    },

    instance: {
      get: {
        verb: 'get',
        success: function success(response) {
          return response.results[0];
        }
      },

      update: {
        verb: 'put'
      },

      increase: {
        verb: 'put',
        args: ['field', 'amount'],
        data: function data(_ref4) {
          var id = _ref4.id;
          var field = _ref4.field;
          var amount = _ref4.amount;
          return _defineProperty({ id: id }, field, Count.increase(amount));
        }
      },

      destroy: {
        verb: 'delete'
      }
    }
  };
};
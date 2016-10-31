'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../FieldTypes');

var pathOf = _require.pathOf;
var Pointer = _require.Pointer;

var _require2 = require('../FieldOps');

var Relation = _require2.Relation;


var filterToParams = require('./filterToParams');
var merge = require('lodash/merge');

var belongsTo = function belongsTo(_ref) {
  var type = _ref.type;
  var foreignType = _ref.foreignType;
  var key = _ref.key;

  if (type && foreignType && key) {
    return {
      instance: {
        get: {
          verb: 'get',
          path: '/:id',
          data: function data(_ref2) {
            var id = _ref2.id;
            return { id: id, include: key, keys: key };
          },
          success: function success(result) {
            return result[key];
          }
        },
        set: {
          verb: 'put',
          path: '/:id',
          args: ["foreignId"],
          data: function data(_ref3) {
            var id = _ref3.id;
            var foreignId = _ref3.foreignId;
            return _defineProperty({ id: id }, key, Pointer(foreignType)(foreignId));
          }
        }
      }
    };
  } else {
    throw "You must provide key, type, foreignType and foreignKey when define a belongsTo relation";
  }
};

var hasMany = function hasMany(_ref5) {
  var type = _ref5.type;
  var foreignType = _ref5.foreignType;
  var key = _ref5.key;
  var foreignKey = _ref5.foreignKey;

  if (type && foreignType && key && foreignKey) {
    //TODO:: vaidate type, foreignType, key and foreignKey
    return {
      collection: {
        find: {
          verb: 'get',
          args: ['filter'],
          base: pathOf(foreignType),
          params: function params(_ref6) {
            var filter = _ref6.filter;
            var id = _ref6.id;
            var relation = _ref6.relation;
            var relationIds = _ref6.relationIds;

            filter = merge(filter, { where: _defineProperty({}, foreignKey, Pointer(type)(id)) });
            return filterToParams(filter);
          },
          success: function success(response) {
            return response.results;
          }
        },

        count: {
          verb: 'get',
          args: ['filter'],
          base: pathOf(foreignType),
          params: function params(_ref7) {
            var filter = _ref7.filter;
            var id = _ref7.id;
            var relation = _ref7.relation;
            var relationIds = _ref7.relationIds;

            filter = merge(filter, { where: _defineProperty({}, foreignKey, Pointer(type)(id)), limit: 0, count: 1 });
            return filterToParams(filter);
          },
          success: function success(response) {
            return response.count;
          }
        },

        create: {
          verb: 'post',
          args: ['data'],
          base: pathOf(foreignType),
          data: function data(_ref8) {
            var _data = _ref8.data;
            var id = _ref8.id;
            var relations = _ref8.relations;
            var relationIds = _ref8.relationIds;

            return Object.assign(_data, _defineProperty({}, foreignKey, Pointer(type)(id)));
          }
        }
      }
    };
  } else {
    throw "Your must provide key, type, foreignType and foreignKey when define a hasMany relation";
  }
};

var hasManyByRelation = function hasManyByRelation(_ref9) {
  var type = _ref9.type;
  var foreignType = _ref9.foreignType;
  var key = _ref9.key;

  if (type && foreignType && key) {
    //TODO:: vaidate type, foreignType and key
    return {
      collection: {
        find: {
          verb: 'get',
          args: ['filter'],
          base: pathOf(foreignType),
          data: function data(_ref10) {
            var filter = _ref10.filter;
            var id = _ref10.id;

            filter = merge(filter, { where: { $relatedTo: { object: Pointer(type)(id), key: key } } });
            return filterToParams(filter);
          },
          success: function success(response) {
            return response.results;
          }
        },

        count: {
          verb: 'get',
          args: ['filter'],
          base: pathOf(foreignType),
          data: function data(_ref11) {
            var filter = _ref11.filter;
            var id = _ref11.id;

            filter = merge(filter, { where: { $relatedTo: { object: Pointer(type)(id), key: key } }, limit: 0, count: 1 });
            return filterToParams(filter);
          },
          success: function success(response) {
            return response.count;
          }
        },

        add: {
          verb: 'put',
          args: ['ids'],
          path: '/:id',
          data: function data(_ref12) {
            var ids = _ref12.ids;
            var id = _ref12.id;
            return _defineProperty({ id: id }, key, Relation(foreignType).add(ids));
          }
        },

        remove: {
          verb: 'put',
          args: ['ids'],
          path: '/:id',
          data: function data(_ref14) {
            var ids = _ref14.ids;
            var id = _ref14.id;
            return _defineProperty({ id: id }, key, Relation(foreignType).remove(ids));
          }
        }
      }
    };
  } else {
    throw "Your must provide key, type and foreignType when define a hasManyByRelation relation";
  }
};

module.exports = {
  belongsTo: belongsTo, hasMany: hasMany, hasManyByRelation: hasManyByRelation
};
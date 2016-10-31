'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var merge = require('lodash/merge');
var createApi = require('fluent-client/dist/createApi');

var _require = require('./FieldTypes');

var pathOf = _require.pathOf;

var resource = require('./templates/resource');

var _require2 = require('./templates/relations');

var _hasMany = _require2.hasMany;
var hasManyByRelation = _require2.hasManyByRelation;
var _belongsTo = _require2.belongsTo;


var reduceTemplate = function reduceTemplate(initial, type, reduceFn) {
  var template = typeof initial === 'function' ? initial() : initial;
  if (!reduceFn) {
    return template;
  }

  var reducers = {
    instance: function instance(methods) {
      template = merge({}, template, { instance: methods });
    },
    collection: function collection(methods) {
      template = merge({}, template, { collection: methods });
    },


    belongsTo: function belongsTo(key, _ref) {
      var foreignType = _ref.type;

      if (!foreignType) {
        throw "Must specify the 'type' in a belongsTo relation.";
      }

      template = merge({}, template, { relations: {
          one: _defineProperty({}, key, _belongsTo({ key: key, type: type, foreignType: foreignType }))
        } });
    },

    hasMany: function hasMany(key, _ref2) {
      var by = _ref2.by;
      var foreignType = _ref2.type;
      var foreignKey = _ref2.foreignKey;

      if (!foreignType) {
        throw "Must specify the 'type' in a hasMany relation.";
      }

      var many = void 0;
      switch (by) {
        case "relations":
          many = _defineProperty({}, key, hasManyByRelation({ type: type, foreignType: foreignType, key: key }));
          break;

        default:
          if (!foreignKey) {
            throw "Must specify the 'foreignKey' when use hasMany by pointer relation.";
          }
          // default is by pointer
          many = _defineProperty({}, key, _hasMany({ type: type, foreignType: foreignType, key: key, foreignKey: foreignKey }));
      }
      template = merge({}, template, { relations: { many: many } });
    }
  };

  reduceFn(reducers);
  return template;
};

module.exports = function ApiFactory(http) {
  return function (_ref3, reduceFn) {
    var type = _ref3.type;
    var template = _ref3.template;

    var initial = template || resource;
    return createApi({ http: http, base: pathOf(type), template: reduceTemplate(initial, type, reduceFn) });
  };
};
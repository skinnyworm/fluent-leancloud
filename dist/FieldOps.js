'use strict';

var _require = require('./FieldTypes');

var Pointer = _require.Pointer;

var isArray = require('lodash/isArray');

function _toPoints(ids, className) {
  ids = isArray(ids) ? ids : [ids];
  return ids.map(function (id) {
    return Pointer(className)(id);
  });
}

function _toArray(data) {
  return isArray(data) ? data : [data];
}

var Relation = function Relation(className) {
  return {
    //添加一个关系
    add: function add(ids) {
      return {
        __op: "AddRelation",
        objects: _toPoints(ids, className)
      };
    },
    //删除一个关系
    remove: function remove(ids) {
      return {
        __op: "RemoveRelation",
        objects: _toPoints(ids, className)
      };
    }
  };
};

var Count = {
  //提供对任何数字字段进行原子增加
  increase: function increase(amount) {
    return {
      __op: "Increment",
      amount: amount
    };
  },
  //提供对任何数字字段进行原子减少
  decrease: function decrease(amount) {
    return {
      __op: "Decrement",
      amount: amount
    };
  }
};

var Array = {
  //在一个数组字段的后面添加一些指定的对象（包装在一个数组内）
  add: function add(data) {
    return {
      __op: "Add",
      objects: _toArray(data)
    };
  },
  //只会在数组内原本没有这个对象的情形下才会添加入数组，插入的位置不定。
  addUnique: function addUnique(data) {
    return {
      __op: "AddUnique",
      objects: _toArray(data)
    };
  },
  //从一个数组内移除所有的指定的对象
  remove: function remove(data) {
    return {
      __op: "Remove",
      objects: _toArray(data)
    };
  }
};

var Bit = {
  and: function and(value) {
    return {
      __op: "BitAnd",
      value: value
    };
  },
  or: function or(value) {
    return {
      __op: "BitOr",
      value: value
    };
  },
  xor: function xor(value) {
    return {
      __op: "BitXor",
      value: value
    };
  }
};

module.exports = {
  Relation: Relation, Count: Count, Array: Array, Bit: Bit
};
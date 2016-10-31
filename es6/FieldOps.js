const {Pointer} = require('./FieldTypes');
const isArray = require('lodash/isArray');

function _toPoints(ids, className){
  ids = isArray(ids) ? ids : [ids];
  return ids.map(id=>Pointer(className)(id))
}

function _toArray(data){
  return isArray(data) ? data : [data];
}


const Relation = (className)=> ({
  //添加一个关系
  add: (ids)=> ({
    __op: "AddRelation",
    objects: _toPoints(ids, className)
  }),
  //删除一个关系
  remove: (ids)=> ({
    __op: "RemoveRelation",
    objects: _toPoints(ids, className)
  })
});

const Count = {
  //提供对任何数字字段进行原子增加
  increase: (amount)=>({
    __op:"Increment",
    amount
  }),
  //提供对任何数字字段进行原子减少
  decrease: (amount)=>({
    __op:"Decrement",
    amount
  })
}

const Array = {
  //在一个数组字段的后面添加一些指定的对象（包装在一个数组内）
  add: (data)=>({
    __op:"Add",
    objects: _toArray(data)
  }),
  //只会在数组内原本没有这个对象的情形下才会添加入数组，插入的位置不定。
  addUnique: (data)=>({
    __op:"AddUnique",
    objects: _toArray(data)
  }),
  //从一个数组内移除所有的指定的对象
  remove: (data)=>({
    __op:"Remove",
    objects: _toArray(data)
  })
}

const Bit = {
  and:(value)=> ({
    __op:"BitAnd",
    value
  }),
  or:(value)=> ({
    __op:"BitOr",
    value
  }),
  xor:(value)=> ({
    __op:"BitXor",
    value
  })
}

module.exports={
  Relation, Count, Array, Bit
}

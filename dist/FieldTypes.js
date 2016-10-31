'use strict';

/**
 * Field type to represet Date encoded in JSON.
 *
 * Usage: {createdAt: Date(new Date)}
 */
var Date = function Date(date) {
  return { __type: 'Date', iso: JSON.stringify(date) };
};

/**
 * Field type to represet a base64 encoded bytes array.
 *
 * Usage: {image: Bytes("base64:xxxxx")}
 */
var Bytes = function Bytes(base64Str) {
  return { __type: 'Bytes', base64: base64Str };
};

/**
 * Field type to store a pointer to data in another collection. It is used to represent
 * hasOne relation
 *
 * Usage: {author: Pointer('User')('1')}
 */
var Pointer = function Pointer(className) {
  return function (objectId) {
    return { __type: "Pointer", className: className, objectId: objectId };
  };
};

/**
 * Field type to store a relation with data in another collection. It is used to represent
 * hasMany relation
 */
var Relation = function Relation(className) {
  return { __type: "Relation", className: className };
};

/**
 * Determine the path of a type
 */
var pathOf = function pathOf(type) {
  return type[0] === '_' ? '/' + type.substring(1).toLowerCase() + 's' : '/classes/' + type;
};

module.exports = {
  Date: Date, Bytes: Bytes, Pointer: Pointer, pathOf: pathOf
};
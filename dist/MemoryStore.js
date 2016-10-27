"use strict";

module.exports = function MemoryStore(initial) {
  var data = Object.assign({}, initial);
  return {
    getItem: function getItem(key) {
      return data[key];
    },
    setItem: function setItem(key, value) {
      data[key] = value;
    },
    deleteItem: function deleteItem(key) {
      delete data[key];
    }
  };
};
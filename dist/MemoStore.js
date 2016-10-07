"use strict";

module.exports = function () {
  var data = {};
  return {
    getItem: function getItem(key) {
      return Promise.resolve(data[key]);
    },
    setItem: function setItem(key, value) {
      data[key] = value;
      return Promise.resolve(true);
    },
    deleteItem: function deleteItem(key) {
      delete data[key];
      return Promise.resolve(true);
    }
  };
};
"use strict";

module.exports = function debugFetch(fetch) {
  return function (url, config) {
    console.info(url, config);
    if (fetch) {
      return fetch(url, config);
    }
  };
};
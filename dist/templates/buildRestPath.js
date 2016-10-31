'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var isEmpty = require('lodash/isEmpty');

/**
 * A reduce function to build path template from location
 * for leancloud path patterns.
 */
module.exports = function buildRestPath(memo, opts) {
  var _opts$location = opts.location;
  var base = _opts$location.base;
  var path = _opts$location.path;
  var id = _opts$location.id;
  var relations = _opts$location.relations;

  var relationIds = _objectWithoutProperties(_opts$location, ['base', 'path', 'id', 'relations']);

  var props = memo.props;
  // make path from base

  var pathComponents = [base];

  if (isEmpty(relations)) {
    // when not using relations then construct normal rest path
    if (id) {
      pathComponents = [].concat(_toConsumableArray(pathComponents), ["/:id"]);
    }
    props = Object.assign(props, { id: id });
  } else {
    props = Object.assign(props, { id: id, relations: relations, relationIds: relationIds });
  }

  //append path component
  if (path) {
    pathComponents = [].concat(_toConsumableArray(pathComponents), [path]);
  }

  // merge ids with props for path template
  return Object.assign(memo, { props: props, pathTemplate: pathComponents.join('') });
};
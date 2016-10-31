const isEmpty = require('lodash/isEmpty');

/**
 * A reduce function to build path template from location
 * for leancloud path patterns.
 */
module.exports = function buildRestPath(memo, opts){
  const {base, path, id, relations, ...relationIds} = opts.location

  let {props} = memo;
  // make path from base
  let pathComponents = [base];

  if(isEmpty(relations)){
    // when not using relations then construct normal rest path
    if(id){
      pathComponents = [...pathComponents, "/:id"];
    }
    props = Object.assign(props, {id});
  }else{
    props = Object.assign(props, {id, relations, relationIds});
  }

  //append path component
  if(path){
    pathComponents = [...pathComponents, path];
  }

  // merge ids with props for path template
  return Object.assign(memo, {props, pathTemplate: pathComponents.join('')});
}

module.exports = function debugFetch(fetch){
  return (url, config)=>{
    console.info(url, config);
    if(fetch){
      return fetch(url, config);
    }
  }
}

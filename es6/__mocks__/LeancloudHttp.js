const Http = ()=>{
  const http = ['get', 'post', 'put', 'delete'].reduce((http, verb)=>{
    http[verb] = jest.fn(()=>Promise.resolve(verb));
    return http;
  }, {})

  return Object.assign(http, {
    argsOf(verb){
      return http[verb].mock.calls[0]
    },
    responseOf(verb, data){
      http[verb].mockReturnValue(Promise.resolve(data));
    }
  });
}

module.exports = Http;

const fetch = require('node-fetch');

exports.handler = async function(event, context){
  try{
    const qs = event.queryStringParameters || {};
    const url = qs.url;
    if (!url) return { statusCode:400, body: JSON.stringify({error:'Provide ?url='}) };
    const res = await fetch(url, {headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'}});
    const html = await res.text();
    return { statusCode:200, body: JSON.stringify({html}) };
  }catch(err){
    return { statusCode:500, body: JSON.stringify({error: err.message}) };
  }
};
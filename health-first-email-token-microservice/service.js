/**
 * service
 * Created by dcorns on 5/9/18
 * Copyright © 2018 Dale Corns
 * MIT Licensed
 */
'use strict';
const http = require('http');
const jwt = require('jwt-simple');
const issueToken = require('./issue-token');
http.createServer((req, res) => {
  const { headers, method, url } = req;
  let body = [];
  req.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    res.on('error', (err) => {
      console.error(err);
    });
    const cmd = url.slice(url.indexOf('/') + 1,url.lastIndexOf('/'));
    switch (cmd)
    {
      case 'token':
        try{
          res.writeHead(200,{'Content-Type':'application/json'});
          const result = {
            token: issueToken(url.slice(url.lastIndexOf('/')+1)),
            status:'success'
          };
          res.end(JSON.stringify(result));
        }
        catch(e){
          res.writeHead(400,{'Content-Type':'application/json'});
          res.end('{"status":"failure"}');
        }
        break;
      case 'validate':
        try{
          res.writeHead(200,{'Content-Type':'application/json'});
          const payload = jwt.decode(url.slice(url.lastIndexOf('/')+1), process.env.SECRET, false, 'HS512');
          payload.status='success';
          res.end(JSON.stringify(payload));
        }
        catch(e){
          res.writeHead(400,{'Content-Type':'application/json'});
          res.end('{"status":"failure"}');
        }
        break;
      default:
        res.writeHead(400,{'Content-Type':'application/json'});
        res.end('{"status":"failure"}');
        break;
    }

  });
}).listen(8080);
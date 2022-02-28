/**
 * Minimal, static server to host FAST.js dist files.
 * 
 * This is primarily used to enable Cypress frontend tests
 */
const http = require('http')
const fs = require('fs')
const path = require('path');
 
const server = http.createServer((req, res) => {  
  const relPath = (new URL(req.url, `http://${req.headers.host}`)).pathname;
  const filePath = path.join('dist', relPath)
  console.log('> Request for ' + relPath);

  if (req.url !== '/' && fs.existsSync(filePath)) {
    file = fs.readFileSync(filePath,'utf-8')
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', ' text/html; charset=utf-8')
    }
    res.write(file)

    console.log('>> Succeeded');
  } else {
    res.statusCode = 404;
    console.log('>> 404');
  }
  res.end();
});

server.listen(8024);
console.log('> Server listening on :8024');
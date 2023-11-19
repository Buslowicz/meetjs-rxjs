const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((request, response) => {
  const path = url.parse(request.url).pathname;
  const data = JSON.parse(fs.readFileSync('mock.json', 'utf8'));
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  response.end(JSON.stringify(path
    .split('/')
    .reduce((acc, curr) => {
      if (curr) {
        return acc[curr];
      }
      return acc;
    }, data)
  ));
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});

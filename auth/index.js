const http = require('http');

const hostname = 'ticketing.dev';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hola Mundo');
});

server.listen(port, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});
  
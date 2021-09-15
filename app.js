const http = require('http');
const requestHandler = require('./routes/routes');


const server = http.createServer(requestHandler)



server.listen(5000);

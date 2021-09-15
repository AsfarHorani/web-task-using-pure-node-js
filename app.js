const http = require('http');
const requestHandler = require('./routes/routes');


const server = http.createServer(requestHandler)



server.listen(process.env.PORT || 5000);

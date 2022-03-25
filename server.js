require('dotenv').config();
const http = require('http');
const fs = require('fs');
const { getSystemErrorMap } = require('util');
const app = require('./app.js');

try {
    const port = process.env.port || 5000;

    const server = http.createServer(app);

    server.listen(port);
} catch( error ) {
    fs.appendFile(__dirname + '/error_file.txt', error);
}

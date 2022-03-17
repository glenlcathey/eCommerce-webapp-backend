try {
    const http = require('http');
    const fs = require('fs');
    const { getSystemErrorMap } = require('util');
    const app = require('./app.js');

    const port = process.env.port || 3000;

    const server = http.createServer(app);

    server.listen(port);
} catch( error ) {
    fs.appendFile(__dirname + '/error_file.txt', error);
}

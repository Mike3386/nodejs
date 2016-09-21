var http = require('http');
var urlVal = require('./urlValidator');
var models = require('./models');

http.createServer((req, res)=> {
    urlVal.ValidateUrl(req,res);
}).listen(1312, "localhost", true);
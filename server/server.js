var http = require('http');
var urlVal = require('./urlValidator');
var models = require('./models');

function process (req, res) {

    urlVal.ValidateUrl(req,res);
}

http.createServer(process).listen(1312, "localhost", true);


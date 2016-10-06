var http = require('http');
var urlVal = require('./urlValidator');
var models = require('./models');

var notify = require('./notifyServ');

//var nt = new notify.Notifire;
//nt.start();
http.createServer((req, res)=> {
    urlVal.ValidateUrl(req,res);
}).listen(1312, "localhost", true);
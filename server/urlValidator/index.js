var url = require('url');
var files = require('../files');
var logger = require('../logger');
var models = require('../models');

var MainPage = "/"
var GetBook = "/GetBook";
var GetAuthor = "/GetAuthor";
var GetBooks = "/GetBooks";
var GetAuthors = "/GetAuthors";
var GetLogger = "/GetLog";

var validators = {};
validators[MainPage] = MainPageValidate;
validators[GetBook] =  GetBookValidate;
validators[GetAuthor] = GetAuthorValidate;
validators[GetBooks] = GetAuthorsValidate;
validators[GetAuthors] = GetBooksValidate;
validators[GetLogger] = GetLoggetValidate;

function IsNumber(s){
    return !isNaN(s);
}

function SendJson(json,res)
{
    res.writeHead(200, {'Content-Type': 'application/json ; charset=utf-8'});
    res.end(JSON.stringify(json));
}

function SendFile(file,res)
{
        res.writeHead(200, {'Content-Type': 'text/html ; charset=utf-8'});
        res.end(file);
}

function GetFirstElem(pathname)
{
    var pos = pathname.indexOf('/');
    if (pos ===0) throw "Error in pathname";
    return pathname.substr(0, pos+1);
}

function GetLoggetValidate(req, res)
{
    var log = files.GetTextFile(logger.PathToLogFile);
    log = log.toString().replace("\n","<br/>");
    SendFile(log,res);
}

function MainPageValidate(req, res)
{
    files.GetMainPage(res);
}

function GetBookValidate(req, res)
{
    var get = url.parse(req.url, true).query; 
    if(get.id&& IsNumber(get.id))SendJson(models.GetBookById(parseInt(get.id)),res);
    else throw "Wrong params of query";
}

function GetAuthorValidate(req, res)
{

}

function GetAuthorsValidate(req, res)
{

}

function GetBooksValidate(req, res)
{
    logger.WriteToLog("Возврат книг");
    var books = models.GetAllBooks();
    SendJson(json, res);
}

exports.ValidateUrl = function (req,res)
{
    try {
        var pathname = url.parse(req.url).pathname;
        logger.WriteToLog("Get request whith pathname = " + pathname);
        validators[pathname](req, res);
    }
    catch (ex)
    {
        res.writeHead(404, {'Content-Type': 'text/html ; charset=utf-8'});
        res.end((ex.message)?ex.message:ex);
    }
}
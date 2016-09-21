var url = require('url');
var files = require('../files');
var logger = require('../logger');
var models = require('../models');

var MainPage = "/"
var GetBook = "/GetBook";
var GetAuthor = "/GetAuthor";
var GetBooks = "/GetBooks";
var GetAuthors = "/GetAuthors";
var EditBook = "/EditBook";
var EditAuthor = "/EditAuthor";
var EditBookPage = "/EditBookPage";
var EditAuthorPage = "/EditAuthorPage";
var GetLogger = "/GetLog";

var validators = {};
validators[MainPage] = MainPageValidate;
validators[GetBook] =  GetBookValidate;
validators[GetAuthor] = GetAuthorValidate;
validators[GetBooks] = GetAuthorsValidate;
validators[GetAuthors] = GetBooksValidate;
validators[GetLogger] = GetLoggetValidate;

validators[EditAuthorPage] = EditAuthorPageValidator;
validators[EditBookPage] = EditBookPageValidator;

validators[EditAuthor] = EditAuthorValidator;
validators[EditBook] = EditBookValidator;


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
    log = log.toString().replace(/\n/g,"<br/>");
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
    var get = url.parse(req.url, true).query; 
    if(get.id && IsNumber(get.id))SendJson(models.GetAuthorById(parseInt(get.id)),res);
    else throw "Wrong params of query";
}

function GetAuthorsValidate(req, res)
{
    var get = url.parse(req.url, true).query;
    var count = (get.count&&!isNan(get.count))?(parseInt(get.count)<0)?20:parseInt(get.count):20; 
    var books = models.GetAllBooks();
    var countOfParts = Math.round(models.length/count);
    if(countOfParts==0) SendJson(books, res);
    else {
        var arrBooks;
        if(get.part&&!isNaN(get.part))
        var part = parseInt(get.part);
        if(part>countOfParts+1) throw "Wrong part"
        else 
        if(part<=countOfParts){
            for(var i=count*(part-1); i<count*part; i++)
            {
                arrBooks.push(books[i]);
            }
        }
         
        /*



        */
    }        
}

function GetBooksValidate(req, res)
{
    logger.WriteToLog("Запрошены все книги");
    var books = models.GetAllBooks();
    SendJson(json, res);
}

function EditBookValidator(req, res)
{

}

function EditAuthorValidator(req, res)
{

}

function EditAuthorPageValidator(req, res)
{

}

function EditBookPageValidator(req, res)
{

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
        logger.WriteToLog("Произошла ошибка " + (ex.message)?ex.message:ex);
    }
}
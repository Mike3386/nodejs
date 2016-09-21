var url = require('url');
var files = require('../files');
var logger = require('../logger');
var models = require('../models');
var MainPage = "/"
var GetBook = "/GetBook";
var GetAuthor = "/GetAuthor";
var GetBooks = "/GetBooks";
var GetAuthors = "/GetAuthors";

var validators = {};
validators[MainPage] = MainPageValidate;
validators[GetBook] =  BookValidate;
validators[GetAuthor] = AuthorValidate;
validators[GetBooks] = AuthorsValidate;
validators[GetAuthors] = BooksValidate;

function GetFirstElem(pathname)
{
    var pos = pathname.indexOf('/');
    if (pos ===0) throw "Error in pathname";
    return pathname.substr(0, pos+1);
}

function MainPageValidate(req, res)
{
    files.GetMainPage(res);
}

function BookValidate(req, res)
{

}

function AuthorValidate(req, res)
{

}

function AuthorsValidate(req, res)
{

}

function BooksValidate(req, res)
{
    logger.WriteToLog("Возврат книг");
    var books = models.GetAllBooks();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(books));
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
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end(ex.message);
    }
}
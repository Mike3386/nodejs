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

function ValidateUrl(req,res)
{
    try {
        var pathname = url.parse(req.url).pathname;

        logger.WriteToLog("Get request whith pathname = " + pathname);

        if(pathname==="/") GetStartPage(res);
        else {
            if(pathname!=""&&pathname.length!=1) pathname = pathname.substr(1,pathname.length-1);
            else throw "Error in pathname";
            var pathFirstElem = GetFirstElem(pathname);
            try {
                validators[pathFirstElem](req, res, pathname);
            } catch (error) {
                throw "Bad query";
            }
        }
    }
    catch (ex)
    {
        res.writeHead(400, {'Content-Type': 'text/html'});
        res.end(ex.message);
    }

}

function GetStartPage(res)
{
    files.GetMainPage(res);
}


//validators for urls

function BookValidate(req, res, pathname)
{

}

function AuthorValidate(req, res, pathname)
{

}

function AuthorsValidate(req, res, pathname)
{

}

function BooksValidate(req, res, pathname)
{
    logger.WriteToLog("Возврат книг");
    var books = models.GetAllBooks();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(books));
}

exports.ValidateUrl = ValidateUrl;
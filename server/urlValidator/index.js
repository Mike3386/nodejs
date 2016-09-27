var url = require('url');
var files = require('../files');
var logger = require('../logger');
var models = require('../models');
var qs = require('querystring');

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
var RemoveBook= "/RemoveBook";
var RemoveAuthor = "/RemoveAuthor";
var AddBook = "/AddBook";
var AddAuthor = "/AddAuthor";

var Jquery = "/jquery.js";
var StyleCss = "/style.css";
var GetScript = "/script.js";

var validators = {};

function IsNumber(s) {
    return !isNaN(s);
}

function SendError(ex, res) {
    res.writeHead(404, {'Content-Type': 'text/html ; charset=utf-8'});
    res.end((ex.message)?ex.message:ex);
    logger.WriteToLog("Произошла ошибка " + (ex.message)?ex.message:ex);
}

function SendJson(json,res) {
    res.writeHead(200, {'Content-Type': 'application/json ; charset=utf-8'});
    res.end(JSON.stringify(json));
}

function SendFile(file,res) {
        res.writeHead(200, {'Content-Type': 'text/html ; charset=utf-8'});
        res.end(file);
}

function GetFirstElem(pathname) {
    var pos = pathname.indexOf('/');
    if (pos ===0) throw "Error in pathname";
    return pathname.substr(0, pos+1);
}

function GetLoggetValidate(req, res) {
    var log = files.GetTextFile(logger.PathToLogFile);
    log = log.toString().replace(/\n/g,"<br/>");
    SendFile(log,res);
}

validators[GetScript] = function (req,res) {
    files.GetJsFile(res);
}

validators[Jquery] = function (req,res) {
    files.GetJquery(res);
}

validators[StyleCss] = function (req, res) {
    files.GetCssFile(res);
}

validators[MainPage] = function (req, res) {
    files.GetMainPage(res);
}

validators[GetBook] = function (req, res) {
    var get = url.parse(req.url, true).query; 
    if(get.id&& IsNumber(get.id))SendJson(models.GetBookById(parseInt(get.id)),res);
    else throw "Wrong params of query";
}

validators[GetAuthor] = function (req, res) {
    var get = url.parse(req.url, true).query; 
    if(get.id && IsNumber(get.id))SendJson(models.GetAuthorById(parseInt(get.id)),res);
    else throw "Wrong params of query";
}

validators[GetAuthors] = function (req, res) {
    var get = url.parse(req.url, true).query;
    var count = (get.count&&!isNan(get.count))?(parseInt(get.count)<0)?20:parseInt(get.count):20; 
    var books = models.GetAllBooks();

    if(get.search&&get.search!="") {
        books = books.filter(function(elem) {
            return (elem.name.indexOf(get.search)===-1)?false:true;
        });
    };
    
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
        }else 
        if(part==countOfParts+1){
            for(var i=count*countOfParts; i<books.count; i++)
            {
                arrBooks.push(books[i]);
            }
        }
        SendJson(arrBooks, res);
    }        
}

validators[GetBooks] = function (req, res) {
    logger.WriteToLog("Запрошены все книги");
    var books = models.GetAllBooks();
    SendJson(books, res);
}

validators[EditBook] = function (req, res) {
    if(req.method=="POST")
    {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk.toString();
        });
        req.on('end', function() {
            try{
                data = qs.parse(data);
                models.EditBook(data);
                SendFile("Book add",res);
            }
            catch(ex)
            {
                SendError(ex, res);
            }
        });
    }
}

validators[EditAuthor] = function (req, res) {
    if(req.method=="POST")
    {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk.toString();
        });
        req.on('end', function() {
            try{
                data = qs.parse(data);
                models.EditAuthor(data);
                SendFile("Author add",res);
            }
            catch(ex)
            {
                SendError(ex, res);
            }
        });
    }
}

validators[EditAuthorPage] = function (req, res) {

}

validators[EditBookPage] = function (req, res) {

}

validators[AddAuthor] = function (req, res) {
    if(req.method=="POST")
    {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk.toString();
        });
        req.on('end', function() {
            try{
                data = qs.parse(data);
                var author = new models.Author(data.name, data.year,data.countOfBooks);
                models.AddAuthor(author);
                SendFile("All good",res);
            }
            catch(ex)
            {
                SendError(ex, res);
            }
        });
    }
}

validators[AddBook] = function (req, res) {
    if(req.method=="POST")
    {
        var data = '';
        req.on('data', function(chunk) {
            data += chunk.toString();
        });
        req.on('end', function() {
            try{
                data = qs.parse(data);
                var book = new models.Book(data.name,data.year,data.author,data.genre);
                models.AddBook(book);
                SendFile("All good",res);
            }
            catch(ex)
            {
                SendError(ex, res);
            }
        });
    }
}

validators[RemoveAuthor] = function (req, res) {
    get = url.parse(req.url,true).query;
    if(get.id&&!isNaN(get.id)) models.RemoveAuthor(get.id);
    else throw "Bad id";
    SendFile("All good");
}

validators[RemoveBook] = function (req, res) {
    get = url.parse(req.url,true).query;
    if(get.id&&!isNaN(get.id)) models.RemoveBook(get.id);
    else throw "Bad id";
    SendFile("All good");
}

exports.ValidateUrl = function (req,res) {
    try {
        var pathname = url.parse(req.url).pathname;
        logger.WriteToLog("Get request whith pathname = " + pathname);
        validators[pathname](req, res);
    }
    catch (ex)
    {
       SendError(ex, res);
    }
}
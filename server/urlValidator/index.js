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
    logger.WriteToLog("Произошла ошибка - " + ex.message);
}

function SendJson(json,res) {
    res.writeHead(200, {'Content-Type': 'application/json ; charset=utf-8'});
    res.end(JSON.stringify(json));
}

function SendElemsArr(arr, maxCount,res) {
    var toSend = {arr:arr,partsCount:maxCount};
    SendJson(toSend, res);
    res.writeHead(200, {'Content-Type': 'application/json ; charset=utf-8'});
    res.end(JSON.stringify(toSend));
}

function SendFile(file,res) {
        res.writeHead(200, {'Content-Type': 'text/html ; charset=utf-8'});
        res.end(file);
}

function SearchArr(arr, p, get) {
        if(get.search&&get.search!=="") {
        arr = arr.filter(function(elem) {
            return (elem[p].indexOf(get.search)===-1)?false:true;
        });
    };
    return arr;
}

function SortArr(arr, get) {
    if(get.sort in arr[0]) arr.sort(function(a, b) {
    if(a[get.sort] < b[get.sort]) return -1;
    if(a[get.sort] > b[get.sort]) return 1;
    return 0;
    }) 
    else if(get.sort) throw new Error("Cant sort by this key, it's not exist");
    return arr;
}

function ProcessArr(arr, get, sortP) {
    if(arr.length==0)return {countOfParts:0,arr:arr};
    var outArr = [];
    var maxCount = (get.count&&!isNaN(get.count))?(parseInt(get.count)<0)?20:parseInt(get.count):20;
    var countOfParts;
    arr = SortArr(arr,get);
    arr = SearchArr(arr, sortP, get);
    if(arr.length!=0)
    {
        countOfParts = Math.round(arr.length/maxCount);
        if(countOfParts==0) return {countOfParts:1,arr:arr};
        else {
            if((arr.length%maxCount!=0)&&(arr.length>maxCount))countOfParts++;
            var part = (get.part&&!isNaN(get.part))?(parseInt(get.part)<0)?1:parseInt(get.part):1; 
            if (part>countOfParts) throw new Error("Wrong part");
            else if (part<countOfParts){
                for(var i=maxCount*(part-1); i<maxCount*part; i++)
                {
                    outArr.push(arr[i]);
                }
            } else if(part===countOfParts){
                for(var i=maxCount*(part-1); i<arr.length; i++)
                {
                    outArr.push(arr[i]);
                }
            }
        }
    }
    else countOfParts = 0;
    return {countOfParts:countOfParts,arr:outArr};
}

validators[GetLogger] = function (req, res) {
    files.GetTextFile(logger.PathToLogFile, (err, data)=>{
        if(!err) {
            data = data.toString().replace(/\n/g,"<br/>");
            SendFile(data.toString(), res);
        }
        else throw new Error("Cant read log file");
    })
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
    else throw new Error("Wrong params of query");
}

validators[GetAuthor] = function (req, res) {
    var get = url.parse(req.url, true).query; 
    if(get.id && IsNumber(get.id))SendJson(models.GetAuthorById(parseInt(get.id)),res);
    else throw new Error("Wrong params of query");
}

validators[GetAuthors] = function (req, res) {
    var get = url.parse(req.url, true).query;
    var authors = models.GetAllAuthors();
    if(authors.length!=0) var arr = ProcessArr(authors,get,"name");
    SendElemsArr(arr.arr, arr.countOfParts, res);
}    

validators[GetBooks] = function (req, res) {
    var get = url.parse(req.url, true).query;
    var books = models.GetAllBooks();
    if(books.length!=0) var arr = ProcessArr(books,get,"bookName");
    SendElemsArr(arr.arr, arr.countOfParts, res);
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
                var book = new models.Book(data.bookName, data.year, data.author, data.genre, data.id); 
                if(models.EditBook(book)) SendFile("Book edit",res);
                else throw new Error("Bad id");
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
                var author = new models.Author(data.name,data.year, data.countOfBooks);
                if(models.EditAuthor(author)) SendFile("Author edit",res);
                else throw new Error("Bad id");
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
                SendFile("Author added",res);
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
                SendFile("Book added",res);
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
    else throw new Error("Bad id")
    SendFile("Author removed", res);
}

validators[RemoveBook] = function (req, res) {
    get = url.parse(req.url,true).query;
    if(get.id&&!isNaN(get.id)) models.RemoveBook(get.id);
    else throw new Error("Bad id");
    SendFile("Book removed", res);
}

exports.ValidateUrl = function (req,res) {
    try {
        var pathname = url.parse(req.url).pathname;
        logger.WriteToLog("Get request whith pathname = " + pathname + "; and full url is = " + req.url);
        validators[pathname](req, res);
    }
    catch (ex)
    {
        if(ex.message==="validators[pathname] is not a function") ex.message="Uknown URL"; 
        SendError(ex, res);
    }
}
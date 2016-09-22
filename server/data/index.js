var logger = require('../logger');
var fs = require('fs');

exports.GetAllBooks = function ()
{
    var booksArray = require("./books.json");
    return booksArray['books'];
}

exports.GetAllAuthos = function ()
{
    var authorsArray = require("./authors.json");
    return authorsArray['authors'];
}

exports.SaveBooks = function (arr)
{
    var json = JSON.stringify({books:arr});
    fs.writeFile('./server/data/books.json', json, (err)=>
    {
        if(err){
            throw "Error in saving books in file"
        }
        else {
            logger.WriteToLog("Books file edit");
        }
    });
}


exports.SaveAuthors = function (arr)
{
    var json = JSON.stringify({authors:arr});
    fs.writeFile('authors.json', json, 'utf8', (err)=>
    {
        if(err){
            throw "Error in saving authors in file"
        }
        else {
            logger.WriteToLog("Authors file edit");
        }
    });
}

exports.AddBook = function (book)
{
    var books = exports.GetAllBooks();
    if(!isExistBook(book)) books.push(book);
    else throw "Book is already exist";
    exports.SaveBooks(books);
}

function compareBooks(book1, book2)
{
    return((book1.bookName==book2.bookName)&&(book1.year==book2.year)&&(book1.genre==book2.genre)&&(book1.author==book2.author));
}

function isExistBook(book)
{
    var check = false;
    var books = exports.GetAllBooks();
    books.forEach(function(element) {
        if(compareBooks(element, book)) check = true;
    }, this);
    return check;
}

function compareAuthors(author1, author2)
{
    return((author1.name==author2.name)&&(author1.year==author2.year)&&(author1.countOfBooks==author2.countOfBooks));
}

function isExistAuthor(author)
{
    var check = false;
    var authors = exports.GetAllAuthos();
    authors.forEach(function(element) {
        if(compareBooks(element, author)) check = true;
    }, this);
    return check;
}

exports.AddAuthor = function (author)
{
    var authors = exports.GetAllAuthos();
    if(!isExistAuthor(author)) authors.push(author);
    else throw "Author is already exist";
    exports.SaveAuthors(authors);
}
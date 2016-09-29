var logger = require('../logger');
var fs = require('fs');

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

exports.isExistAuthor = function (author)
{
    var check = false;
    var authors = exports.GetAllAuthos();
    authors.forEach(function(element) {
        if(compareAuthors(element, author)) check = true;
    }, this);
    return check;
}

exports.isExistAuthorByName = function (name)
{
    var check = false;
    var authors = exports.GetAllAuthos();
    authors.forEach(function(element) {
        if(element.name===name) check = true;
    }, this);
    return check;
}

exports.GetAllBooks = function ()
{
    var booksArray = require("./books.json");
    return booksArray;
}

exports.GetAllAuthos = function ()
{
    var authorsArray = require("./authors.json");
    return authorsArray;
}

exports.SaveBooks = function (arr)
{
    arr.sort((el1,el2)=>{
        if(el1.id>el2.id) return 1;
        else return -1;
    })
    var json = JSON.stringify(arr);
    fs.writeFile('./server/data/books.json', json, (err)=>
    {
        if(err){
            throw new Exception("Error in saving books in file");
        }
        else {
            logger.WriteToLog("Books file edit");
        }
    });
}


exports.SaveAuthors = function (arr)
{
    arr.sort((el1,el2)=>{
        return (el1.id>el2.id);
    })
    var json = JSON.stringify(arr);
    fs.writeFile('./server/data/authors.json', json, 'utf8', (err)=>
    {
        if(err){
            throw new Exception("Error in saving authors in file");
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
    else throw new Exception("Book is already exist");
    exports.SaveBooks(books);
}

exports.AddAuthor = function (author)
{
    var authors = exports.GetAllAuthos();
    if(!isExistAuthor(author)) authors.push(author);
    else throw new Exception("Author is already exist");
    exports.SaveAuthors(authors);
}
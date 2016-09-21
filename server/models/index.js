"use strict";
var logger = require('../logger');
var data = require('../data');
class Author
{
    constructor(name, year, countOfBooks)
    {
        this.id = id;
        this.name = name;
        this.year = year;
        this.countOfBooks = countOfBooks;

    }
}

class Book
{
    constructor(bookName, year, author, genre) {
        this.id = GetIdForBook();
        this.bookName = bookName;
        this.year = year;
        this.author = author;
        this.genre = genre;
        logger.WriteToLog("Created book id="+this.id + " bookName="+
            this.bookName+" year=" + this.year + " author="+this.author + " genre="+this.genre);
    }
}

/**
 * @return {number}
 */
function GetIdForBook()
{
    var books = GetAllBooks();
    if(books.length==0) return 1;
    else
        if(books.length==1) return parseInt(books[0].id)+1;
    {
        books.sort((a,b)=>
        {
            return -a.id+b.id;
        });
        return parseInt(books[0].id)+1;
    }
}

function GetAllBooks() {
    return data.GetAllBooks();
}

function GetAllAuthors() {
    return data.GetAllAuthos();
}

function SaveBooks(books) {
    data.SaveBooks(books);
}

function SaveAuthors(authors) {
    data.SaveAuthors(authors);
}

function GetBookById(id) {
    var books = GetAllBooks();
    var book;
    books.forEach(function(item, i, books) {
        if(item.id===id)book=item;
    });
    if(book==null) throw "Bad id";
    return book;
}

function AddBook(book)
{
    data.AddBook(book);
}

function GetAuthorById(id) {
    var authors = GetAllAuthors();
    var author;
    authors.forEach(function (item, i, books) {
        if(item.id===id)author=item;
    })
    if(author==null)throw "Bad id";
    return author;
}

module.exports.Author = Author;
module.exports.Book = Book;
module.exports.GetBookById = GetBookById;
module.exports.GetAllBooks = GetAllBooks;
module.exports.GetAllAuthors = GetAllAuthors;
module.exports.GetAuthorById = GetAuthorById;
module.exports.AddBook = AddBook;
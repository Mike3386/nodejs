"use strict";
var logger = require('../logger');
var data = require('../data');

class Author
{
    constructor(name, year, countOfBooks)
    {
        var regForName = /[А-Я1-9]+/;
        if(regForName.test(name))
        this.name = name;
        else throw "Wrong name";
        this.id = GetIdForAuthor();
        if(!isNaN(year)) this.year = parseInt(year);
        else throw "Wrong year";
        if(!isNaN(year)) this.countOfBooks = countOfBooks;
        else throw "Wrong countOfBooks";
    }
}

class Book
{
    constructor(bookName, year, author, genre) {
        if(bookName&&year&&author&&genre)
        {
            this.id = GetIdForBook();
            var regForBookName = /[А-Я1-9]+/;
            if(regForBookName.test(bookName)) this.bookName = bookName;
            else throw "Wrong bookName";
            if(!isNaN(year)) this.year = parseInt(year);
            else throw "Wrong year";
            var regForName = /[А-Я1-9]+/;
            if(regForName.test(author)&&IsExistAuthor(author)) this.author = author;
            else throw "Wrong author";
            var regForName = /[а-я]+/;
            if(regForName.test(genre))
            this.genre = genre;
            else throw "Wrong genre";
            logger.WriteToLog("Created book id="+this.id + " bookName="+
            this.bookName+" year=" + this.year + " author="+this.author + " genre="+this.genre);
        }
        else throw "Sended not all parametrs";
    }
}

function GetIdForBook()
{
    var books = GetAllBooks();
    if(books.length==0) return 1;
    else
        if(books.length==1) return parseInt(books[0].id)+1;
    {
        books.sort((a,b)=>
        {
            return -parseInt(a.id)+parseInt(b.id);
        });
        return parseInt(books[0].id)+1;
    }
}

function GetIdForAuthor()
{
    var authors = GetAllAuthors();
    if(authors.length==0) return 1;
    else
        if(authors.length==1) return parseInt(authors[0].id)+1;
    {
        authors.sort((a,b)=>
        {
            return -a.id+b.id;
        });
        return parseInt(authors[0].id)+1;
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
        if(parseInt(item.id)===id)book=item;
    });
    if(book==null) throw "Bad id";
    return book;
}

function AddBook(book)
{
    data.AddBook(book);
}

function AddAuthor(author)
{
    data.AddAuthor(author);
}

function GetAuthorById(id) {
    var authors = GetAllAuthors();
    var author;
    authors.forEach(function (item, i, books) {
        if(parseInt(item.id)===id)author=item;
    })
    if(author==null)throw "Bad id";
    return author;
}

function IsExistAuthor(name)
{
    var authors = GetAllAuthors();
    var author;
    authors.forEach(function (item, i, books) {
        if(item.name===name)author=item;
    })
    return author==null;
}

function EditBook(book)
{
    var check = false;
    var books = GetAllBooks();
    books.forEach(function(element) {
        if(parseInt(element.id)===book.id) 
        {
            element = book;
            check = true;
        }
    }, this);
    return check;
}

function EditAuthor(author)
{
    var check = false;
    var authors = GetAllAuthors();
    authors.forEach(function(element) {
        if(parseInt(element.id)===author.id) {
                element = author;
                check = true;
            }
    }, this);
    return check;
}

exports.RemoveAuthor = function (id)
{
    var books = GetAllBooks();
    var book = books.find((element)=>{
        return element.id==id;
    });
    if(book) books = books.splice(indexOf(book),1);
    else throw "Book not found";

    SaveBooks(books);
}

exports.RemoveAuthor = function (id)
{
    var authors = GetAllBooks();
    var author = books.find((element)=>{
        return element.id==id;
    });
    if(author) authors =author.splice(indexOf(author),1);
    else throw "Book not found";

    SaveAuthors(authors);
}

exports.Author = Author;
exports.Book = Book;
exports.GetBookById = GetBookById;
exports.GetAllBooks = GetAllBooks;
exports.GetAllAuthors = GetAllAuthors;
exports.GetAuthorById = GetAuthorById;
exports.AddBook = AddBook;
exports.EditAuthor = EditAuthor;
exports.EditBook = EditBook;
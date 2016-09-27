"use strict";
var logger = require('../logger');
var data = require('../data');

exports.Author = class {
    constructor(name, year, countOfBooks) {
        if(name&&year&&countOfBooks) {
            var regForName = /[А-Я][а-я]+\s[А-Я].[А-Я]./;
            if(regForName.test(name)) this.name = name;
            else throw "Wrong name";
            this.id = GetIdForAuthor();
            if(!isNaN(year)) this.year = parseInt(year);
            else throw "Wrong year";
            if(!isNaN(year)) this.countOfBooks = countOfBooks;
            else throw "Wrong countOfBooks";
            logger.WriteToLog("Created author id=" + this.id + " name="+
            this.name+" year=" + this.year + " authcountOfBooksor=" + this.countOfBooks);
        }
        else throw "Sended not all parametrs";
    }
}

exports.Book = class {
    constructor(bookName, year, author, genre) {
        if(bookName&&year&&author&&genre)
        {
            this.id = GetIdForBook();
            var regForBookName = /[А-Яа-я\s.]+/;
            if(regForBookName.test(bookName)) this.bookName = bookName;
            else throw "Wrong bookName";
            if(!isNaN(year)) this.year = parseInt(year);
            else throw "Wrong year";
            var regForName = /[А-Я][а-я]+\s[А-Я].[А-Я]./;
            if(regForName.test(author)&&IsExistAuthor(author)) this.author = author;
            else throw "Wrong author";
            var regForName = /[А-Я][а-я]+/;
            if(regForName.test(genre))
            this.genre = genre;
            else throw "Wrong genre";
            logger.WriteToLog("Created book id="+this.id + " bookName="+
            this.bookName+" year=" + this.year + " author="+this.author + " genre="+this.genre);
        }
        else throw "Sended not all parametrs";
    }
}

function GetIdForBook() {
    var books = exports.GetAllBooks();
    if(books.length==0) return 1;
    else if(books.length==1) return parseInt(books[0].id)+1;
    books.sort((a,b)=> {
        return -parseInt(a.id)+parseInt(b.id);
    });
    return parseInt(books[0].id)+1;
}

function GetIdForAuthor()
{
    var authors = exports.GetAllAuthors();
    if(authors.length==0) return 1;
    else if(authors.length==1) return parseInt(authors[0].id)+1;
    authors.sort((a,b)=> {
        return -parseInt(a.id)+parseInt(b.id);
    });
    return parseInt(authors[0].id)+1;
}

exports.GetAllBooks = function () {
    return data.GetAllBooks();
}

exports.GetAllAuthors = function () {
    return data.GetAllAuthos();
}

function SaveBooks(books) {
    data.SaveBooks(books);
}

function SaveAuthors(authors) {
    data.SaveAuthors(authors);
}

exports.GetBookById = function (id) {
    var books = GetAllBooks();
    var book;
    books.forEach(function(item, i, books) {
        if(parseInt(item.id)===id)book=item;
    });
    if(book==null) throw "Bad id";
    return book;
}

exports.AddBook = function (book)
{
    data.AddBook(book);
}

exports.AddAuthor = function (author)
{
    data.AddAuthor(author);
}

exports.GetAuthorById = function (id) {
    var authors = GetAllAuthors();
    var author;
    authors.forEach(function (item, i, books) {
        if(parseInt(item.id)===id)author=item;
    })
    if(author==null)throw "Bad id";
    return author;
}

exports.IsExistAuthor = function (name)
{
    var authors = GetAllAuthors();
    var author;
    authors.forEach(function (item, i, books) {
        if(item.name===name)author=item;
    })
    return author==null;
}

exports.EditBook = function (book)
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

exports.EditAuthor = function (author)
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
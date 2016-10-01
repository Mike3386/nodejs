"use strict";
var logger = require('../logger');
var data = require('../data');
var excep = require('../exception');
var exception = excep.exception;

exports.Author = class {
    constructor(name, year, countOfBooks, id) {
        if(name&&year&&countOfBooks) {
            var errors = [];
            var regForName = /^[А-Я][а-я]+\s[А-Я]\.[А-Я]\.$/;
            if(regForName.test(name)) this.name = name;
            else errors.push("Неверное имя");
            
            this.id =(!id)?GetIdForAuthor():parseInt(id);

            var regForYearAuthor = /^[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]$/;
            if(regForYearAuthor.test(year)) this.year = year;
            else errors.push("Неверный год");    

            if(!isNaN(countOfBooks)) this.countOfBooks = countOfBooks;
            else errors.push("Неверное количество книг");
            
            if(errors.length === 0) logger.WriteToLog("Created object author id=" + this.id + " name="+
            this.name+" year=" + this.year + " authcountOfBooksor=" + this.countOfBooks);
            else {
                throw new exception(errors, 500);
            }
        }
        else throw new exception("Sended not all parametrs", 206);
    }
}

exports.Book = class {
    constructor(bookName, year, author, genre, id) {
        if(bookName&&year&&author&&genre)
        {
            var errors = [];
            this.id = (id)?parseInt(id):GetIdForBook();

            var regForBookName = /[А-Яа-я\s.]+/;
            if(regForBookName.test(bookName)) this.bookName = bookName;
            else errors.push("Неверное название книги");
            
            if(!isNaN(year)) this.year = parseInt(year);
            else errors.push("Неверный год");

            var regForName = /^[А-Я][а-я]+\s[А-Я]\.[А-Я]\.$/;
            if(regForName.test(author)&&data.isExistAuthorByName(author)) this.author = author;
            else errors.push("Неверный автор");

            var regForName = /^[А-Я][а-я]+$/;
            if(regForName.test(genre)) this.genre = genre;
            else errors.push("Неверный жанр");
            
            if(errors.length === 0) logger.WriteToLog("Created object book id="+this.id + " bookName="+
            this.bookName+" year=" + this.year + " author="+this.author + " genre="+this.genre);
            else {
                throw new exception(errors, 500);
            }
        }
        else throw new Error("Sended not all parametrs", 206);
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

function GetIdForAuthor() {
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
    var books = data.GetAllBooks();
    var book;
    books.forEach(function(item, i, books) {
        if(parseInt(item.id)===id)book=item;
    });
    if(book==null) throw new exception("Bad id", 500);
    return book;
}

exports.AddBook = function (book) {
    data.AddBook(book);
}

exports.AddAuthor = function (author) {
    data.AddAuthor(author);
}

exports.GetAuthorById = function (id) {
    var authors = data.GetAllAuthos();
    var author;
    authors.forEach(function (item, i, books) {
        if(parseInt(item.id)===id)author=item;
    })
    if(author==null)throw new exception("Bad id", 500);
    return author;
}

exports.IsExistAuthor = function (name) {
    var authors = GetAllAuthors();
    var author;
    authors.forEach(function (item, i, books) {
        if(item.name===name)author=item;
    })
    return author==null;
}

exports.EditBook = function (book) {
    if(data.isExistAuthorByName(book.author)) { 
        var check = false;
        var books = data.GetAllBooks();
        books.forEach(function(element) {
            if(parseInt(element.id)===book.id) 
            {
                books[books.indexOf(element)] = book;
                check = true;
            }
        }, this);
        if(check)data.SaveBooks(books);
        return check;
    } else throw new exception("Author is not exist", 500);
    
}

exports.EditAuthor = function (author) {
    var check = false;
    var authors = exports.GetAllAuthors();
    authors.forEach(function(element) {
        if(parseInt(element.id)===author.id) {
                authors[authors.indexOf(element)] = author;
                check = true;
            }
    }, this);
    if(check)data.SaveAuthors(authors);
    return check;
}

exports.RemoveBook = function (id) {
    var books = exports.GetAllBooks();
    var book = books.find((element)=>{
        return element.id==id;
    });
    if(book) books.splice(books.indexOf(book),1);
    else throw new exception("Book not found", 500);

    SaveBooks(books);
}

exports.RemoveAuthor = function (id) {
    var authors = exports.GetAllAuthors();
    var author = authors.find((element)=>{
        return element.id==id;
    });
    if(author) authors.splice(authors.indexOf(author),1);
    else throw new exception("Author not found", 500);

    SaveAuthors(authors);
}
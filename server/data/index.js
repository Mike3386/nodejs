var logger = require('../logger');
var fs = require('fs');

module.exports.GetAllBooks = function ()
{
    var booksArray = require("./books.json");
    return booksArray['books'];
}

module.exports.GetAllAuthos = function ()
{
    var authorsArray = require("./authors.json");
    return authorsArray['authors'];
}

module.exports.SaveBooks = function (arr)
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


module.exports.SaveAuthors = function (arr)
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

module.exports.AddBook = function (book)
{
    var books = exports.GetAllBooks();
    books.push(book);
    exports.SaveBooks(books);
}


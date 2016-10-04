var fs = require('fs');

exports.GetMainPage = function (res) {
    fs.readFile("D:/node/node/nodejs/page/index.html", function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
        }else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data.toString());
        }
        res.end();
    });
}

exports.GetPage = function (res, page) {
    fs.readFile("D:/node/node/nodejs/page/"+page, function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
        }else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data.toString());
        }
        res.end();
    });
}

exports.GetCss = function (res, page) {
    fs.readFile("D:/node/node/nodejs/page/"+page, function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
        }else {
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data.toString());
        }
        res.end();
    });
}

exports.GetJsFile = function (res, name) {
    fs.readFile("D:/node/node/nodejs/page/"+name, 'utf-8', function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(err);
        }else {
            res.writeHead(200, {'Content-Type': 'application/javascript'});
            res.write(data.toString());
        }
        res.end();
    });
}

exports.GetTextFile = function (path, callback) {
    return fs.readFile(path, callback);
}
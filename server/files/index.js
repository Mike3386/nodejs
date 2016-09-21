var fs = require('fs');

function GetMainPage(res) {
    fs.readFile("D:/node/project1/page/index.html", function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data.toString());
        }
        res.end();
    });
}

exports.GetMainPage = GetMainPage;
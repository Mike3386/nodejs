var fs = require('fs');
var pathToLog = 'D:/node/project1/server/logger/log.txt';

function WriteToLog(message) {
    var date = new Date;
    message =  date.getFullYear()+"."+date.getMonth()+"."+date.getDay()+"|"+date.getHours()+":"+date.getMinutes()+": \t"+message+'\n';
    fs.appendFile(pathToLog, message, (err) => {
        if (err) throw err.message;
    });
}

exports.WriteToLog = WriteToLog;
exports.PathToLogFile = pathToLog;
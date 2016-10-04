"use strict";
var ws = require('ws');
var logger = require('../logger');

exports.Notifire = new class{
    start() {
        var clients = {};
        var webS = new ws.Server( {
            port:1313
        });

        exports.webS.on('connection', (ws) => {
            var id = Math.random();
            clients[id] = ws;
            logger.WriteToLog("Новый клиент " + id);
            ws.on('message', function(message) {
                    logger.WriteToLog("Get message from client " + id);
                }
            );
            ws.on('close', function() {
                delete clients[id];
            });
        });
    };
};
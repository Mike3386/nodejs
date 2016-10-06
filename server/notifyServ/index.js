"use strict";
var ws = require('ws');
var logger = require('../logger');
var notifyer = require('../notifyer');

var clients = {};
var webS = new ws.Server( {
    port : 1313
});

webS.on('connection', (ws) => {
    var id = Math.round(Math.random()*10000);
    while(clients[id]) id = Math.round(Math.random()*10000);
    clients[id] = ws;
    logger.WriteToLog("Новый клиент " + id);
    ws.on('message', (message) => {
            if(!notifyer.ProccessMessage(message, id)) clients[id].send(JSON.stringify({message:"Uknown event or event type"}));
        }
    );

    ws.on('error', (err) => {
        console.log(err.message);
    })

    ws.on('close', () => {
        delete clients[id];
        notifyer.UnSubAllEv(id);
    });
});

exports.notifyClientById = function (id, message, event, status, eventType) {
    var message = {event:event, message:message, status:status, eventType:eventType}
    clients[id].send(JSON.stringify(message));
}

exports.wss = webS;
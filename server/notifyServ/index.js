"use strict";
var ws = require('ws');
var logger = require('../logger');

exports.Notifire = class{
    constructor(){
        this.clients = {};
    }
    start() {
        var webS = new ws.Server( {
            port:1313
        });

        webS.on('connection', (ws) => {
            var id = Math.round(Math.random()*10000);
            this.clients[id] = ws;
            logger.WriteToLog("Новый клиент " + id);
            ws.on('message', (message) => {
                    
                }
            );

            ws.on('close', () => {
                delete this.clients[id];
            });
        });
    };
};
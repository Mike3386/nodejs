var logger = require('../logger');
var ns = require('../notifyService');
var notifyServ = require('../notifyServ');
var events = ["AddBook","AddAuthor","EditBook", "EditAuthor", "RemoveBook", "RemoveAuthor"];
function NotifyOnce(id, type) {
    ns.ns.on(type, id, "Once");
}

function NotifyAlways(id, type) {
    ns.ns.on(type, id, "Always");
}

function NotifyBy(id, type, count) {
    ns.ns.on(type, id, "By", count);
}

function UnSub(id, type) {
    ns.ns.unSub(id,type);
    notifyServ.notifyClientById(id, "Sub " + type + " removed", type, "unSub");
}

exports.UnSubAllEv = function (id) {
    ns.ns.unSub(id, "all");
}

exports.ProccessMessage = function (message, id) {
    message = JSON.parse(message);
    if(message.eventType&&message.event) {
        if(events.find((elem)=>{
            return elem===message.event;
        })) {
            if(message.eventType==="Once") NotifyOnce(id, message.event);
            else if(message.eventType==="Always") NotifyAlways(id, message.event);
            else if(message.eventType==="By") {
                if(message.count&&!isNaN(message.count)&&parseInt(message.count)>0) NotifyBy(id, message.event, parseInt(message.count));
                else notifyServ.notifyClientById(id, "Please input current count");
            }
            else if(message.eventType==="UnSub") UnSub(id, message.event);
            else return false;
        } else return false;
    }
    return true;
}
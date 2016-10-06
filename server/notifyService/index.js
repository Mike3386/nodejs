var notifyServ = require('../notifyServ');

function NotifyService() {
    var self = this;

    self.subs = {};

    self.on = (event, id, type, count) => {
        if (!self.subs[id]) self.subs[id] = [];
        else {
            var check = false;
            self.subs[id].forEach(function(element) {
                if(element.event===event) check = true;
            }, this);
        }
        
        if(!check) {
            if(type==="By") self.subs[id].push({event:event, id:id, type:type, currCount:0, count:count});
            else self.subs[id].push({event:event, id:id, type:type});
            var oEv = (type==="By")?type + count:type;
            notifyServ.notifyClientById(id,"Subscribed on event " + event, event, "sub",oEv );
        } else notifyServ.notifyClientById(id,"You are already subscribe on this event");
    };
    
    self.unSub = (id, type) => {
        if(type!="all") {
            var index = self.subs[id].findIndex( (elem, index, array)=> {
                return elem.event===type;
            })
            if(index!=-1) self.subs[id].splice(index, 1);
        } else {
            if(self.subs[id]) delete self.subs[id];
        }
    }

    self.emit = (event, data) => {
        for(var i in self.subs) {
            self.subs[i].forEach(function(element, index) {
                if(element.event===event) {
                    if(element.type==="Always") notifyServ.notifyClientById(element.id, event);
                    else if(element.type==="By") {
                        element.currCount++;
                        if(element.currCount==element.count) {
                            element.currCount=0;
                            notifyServ.notifyClientById(element.id, event);
                        }
                        self.subs[i][index]=element;
                    } else if(element.type==="Once") {
                        notifyServ.notifyClientById(element.id, event);
                        self.subs[i].splice(index,1);
                    }
                }
            }, this);
        };
    };
}

var ns = new NotifyService();

exports.ns = ns;
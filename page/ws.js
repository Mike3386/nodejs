var socket = new WebSocket("ws://localhost:1313");

if(socket) {
    $("#send").on('click', function() {
        var type = $("#type option:selected").text();
        var event = $("#event option:selected").text();
        var count = $("#count").val();
        var mess = {event:event, eventType:type,count:count};
        socket.send(JSON.stringify(mess));
        return false;
    });

    socket.onmessage = function(event) {
        var incomingMessage = event.data;
        incomingMessage = JSON.parse(incomingMessage);
        showMessage(incomingMessage);
    };

    socket.onerror = function(error) {
        alert(error);
    }

    socket.onclose = function() {
        alert("Connection closed, please restart");
    }

    function showMessage(message) {
        $("#subscribe").append(message.message+"<br/>");

        if (message.event) {
            if(message.status==="sub") $("#"+message.event).html('sub '+message.eventType);
            else if(message.status==="unSub") $("#"+message.event).html('unSub');
        }
    }
}
else alter("can't connect to the ws");

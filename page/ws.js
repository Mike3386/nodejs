var socket = new WebSocket("ws://localhost:1313");

$("#send").on('click', function() {
  var outgoingMessage = $("#text").value();
  socket.send(outgoingMessage);
  return false;
});

socket.onmessage = function(event) {
  var incomingMessage = event.data;
  showMessage(incomingMessage);
};

function showMessage(message) {
    $("#subscribe").html(message);
}
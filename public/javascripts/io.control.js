(function(window) {
  var client = io.connect();
  var userElement = document.getElmentById('user');

  client.on('move', function (data) {
    userElement.style.top = data.clientX + 'px';
    userElement.style.left = data.clientY + 'px';
  });

  // mouse movement
  window.document.onmousemove = function (pos) {

    console.log('X: ' + pos.clientX + ', Y' + pos.clientY);

    var user = {
      clientX: pos.clientX,
      clientY: pos.clientY
    };

    client.emit('move', user);
  };

})(window);

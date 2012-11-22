(function(window) {

  // get URL parameter
  function getURLParameter(name) {
      return decodeURI(
          (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
      );
  }

  var config = {
    host: 'http://localhost:3000/'
  };
  var client = io.connect(config.host);
  var userElement;
  var pointEle;
  var clientId = getURLParameter('id');

  client.emit('query-room-list');

  client.on('scroll-feedback', function (data) {
    window.document.body.scrollTop = data.scrollTop;
  });

  client.on('canvas', function (data) {
    var myCanvas = document.getElementById('canvas1');
    var ctx = myCanvas.getContext('2d');
    var img = new Image;

    myCanvas.width = data.width;
    myCanvas.height = data.height;
    img.onload = function(){
      ctx.drawImage(img,0,0); // Or at whatever offset you like
    };
    img.src = data.dataURI;
  });

  client.emit('init-control', {clientId: clientId});


  client.emit('send-message-control', {clientId: clientId, message: message});

  client.on('client-disconnect', function (data) {
    if (data.clientid === clientid) {
        alert('client is disconnect');
        history.go(-1);
    }
  });

  // mouse movement
  window.document.onclick = function () {
    client.emit('click-control', {clientId: clientId, time: new Date()});

    // fixed rerender issue;
    window.document.body.scrollTop = 0;
  };

  window.document.onscroll = function () {
    client.emit('scroll-control', {clientId: clientId, scrollTop: window.document.body.scrollTop});
  };

  window.document.onmousemove = function (pos) {

    var user = {
      clientX: pos.clientX,
      clientY: pos.clientY,
      clientId: clientId
    };

    client.emit('move', user);
  };


})(window);

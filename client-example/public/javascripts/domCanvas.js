(function($, document, window) {
  $(document).ready(function () {
  var userElement;
  var pointEle;
  var pos = {
    clientY : 0,
    clientX : 0
  };

  var config = {
    host: 'http://localhost:3000/'
  };

  var client = io.connect(config.host);
  var roomId;

  client.emit('init-client');
  client.on('init-client', function (data) {
    roomId = data.roomId;
  });

  function renderHtml2Canvas() {
    var g = $('body'),
        h = {
            onrendered: function (j) {

                var data = {
                  height: j.height,
                  width: j.width,
                  dataURI: j.toDataURL()
                };
                client.emit('canvas', data);
            },
            allowTaint: true,
            taintTest: false
        }, i = html2canvas(g, h);
  }

  client.on('init-client', function () {
    console.log('[STATUS] socket.io initial');

    renderHtml2Canvas();

    userElement = document.getElementById('pointServer');

    if ( ! userElement) {
      userElement = document.createElement('div');
      userElement.id = 'pointServer';
      var attrs = [
          'position: absolute',
          'width: 10px',
          'height: 10px',
          //'width: 24px',
          //'height: 20px',
          'background-color: #000',
          //'background: transparent url("http://localhost:3000/images/dragonfly.gif")',
          'z-index: 9999',
          'border-radius: 5px'
      ].join(';');
      userElement.setAttribute('style', attrs);

      document.body.appendChild(userElement);

    }

    client.on('move', function (data) {

      // update position data;
      pos = data;

      // update element position;
      userElement.style.top = (parseInt(window.document.body.scrollTop, 10) + parseInt(data.clientY, 10)) + 'px';
      userElement.style.left = data.clientX + 'px';

    });
    client.on('click-client', function () {
      userElement.style.display = 'none';

      if (pointEle) pointEle.style.border ="";
      pointEle = document.elementFromPoint(pos.clientX, pos.clientY);
      pointEle.style.border = "5px solid #f00";

/*
      // trigger pointer element event
      switch(pointEle.tagName.toLowerCase()) {
        case "a":
          var elHref = pointEle.attributes.href.value;
          if (elHref) location.href = elHref;
          break;
        case "button":
        case "input":
          var elType = pointEle.attributes.type.value;

          if (elType === 'submit') $(pointEle).trigger('submit');
          break;
      }
*/
      //client.emit('scroll-feedback', {scrollTop: window.document.body.scrollTop});


      userElement.style.display = 'block';

      setTimeout(function () {
        renderHtml2Canvas(window.document.body.scrollTop);
      }, 50);
    });
    client.on('scroll-client', function (data) {
      window.document.body.scrollTop = data.scrollTop;
    });

  });

  });
}(jQuery, document, window));

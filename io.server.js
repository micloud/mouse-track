module.exports.init = function (server)  {

  var socketio = require('socket.io');
  var io = socketio.listen(server);
  var room = [];
  var adminId = '';

  io.sockets.on('connection', function (client) {

      client.on('query-room-list', function () {
        console.log('[STATUS] ROOMID: ' + client.id + ' updated');
        adminId = client.id;
        client.emit('query-room-list', room);
      });
      client.on('init-control', function (data) {
        io.sockets.socket(data.clientId).emit('init-client', data);
      });
      client.on('click-control', function (data) {
        data.id = client.id;
        io.sockets.socket(data.clientId).emit('click-client', data);
      });
      client.on('scroll-control', function (data) {
        data.id = client.id;
        io.sockets.socket(data.clientId).emit('scroll-client', data);
      });
      client.on('send-message-control', function (data) {
        data.id = client.id;
        io.sockets.socket(data.clientId).emit('send-message-client', data);
      });
      client.on('move', function (data) {
        data.id = client.id;
        io.sockets.socket(data.clientId).emit('move', data);
      });

      /*
       * client feedback to controller
       */
      // client initial to registe infomation to server
      client.on('init-client', function () {
        if (client.id) room.push(client.id);
        console.log('[STATUS] ROOMID: ' + client.id + ' updated');
        io.sockets.socket(adminId).emit('query-room-list', room);
      });
      client.on('scroll-feedback', function (data) {
        data.id = client.id;
        //client.broadcast.emit('scroll-feedback', data);
        io.sockets.socket(adminId).emit('scroll-feedback', data);
      });
      client.on('canvas', function (data) {
        io.sockets.socket(adminId).emit('canvas', data);
      });
      // remove disconnect client
      client.on('disconnect', function (data) {

        // when user disconnect, send data to controller
        io.sockets.socket(adminId).emit('client-disconnect', {clientId: client.id});

        var key = room.indexOf(client.id);;
        if (key > -1) room.splice(key, 1);
        io.sockets.socket(adminId).emit('query-room-list', room);
      });

  });
};

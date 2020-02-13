const socketio = require('socket.io');
const stringToArray = require('./utils/StringToArray');
const calcDistance = require('./utils/calcDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
  io = socketio(server);

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: stringToArray(techs),
    });
  });
}

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return calcDistance(coordinates, connection.coordinates) < 10
      && connection.techs.some(item => techs.includes(item));
  });
}

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
}
class Socket {
  constructor(io, markerList) {
    this.io = io;
    this.markers = markerList;
  }

  socketEvents() {
    this.io.on('connection', (socket) => {
      socket.emit('acitve-markers', this.markers.actives);

      socket.on('add-marker', (marker) => {
        this.markers.addMarker(marker);
        socket.broadcast.emit('new-marker', marker);
      });

      socket.on('update-marker', (marker) => {
        this.markers.updateMarker(marker);
        socket.broadcast.emit('update-a-marker', marker);
      });
    });
  }
}

module.exports = Socket;

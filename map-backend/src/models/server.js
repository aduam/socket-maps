const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const Socket = require('./socket');
const MarkerList = require('./marker-list');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 2001;

    this.server = http.createServer(this.app);
    this.io = socketio(this.server);
    this.markerList = new MarkerList();
  }

  middlewares() {
    this.app.use(cors());
  }

  sockets() {
    const sockets = new Socket(this.io, this.markerList);
    sockets.socketEvents();
  }

  rest() {
    this.app.get('/', (req, res, next) => {
      res.status(200).json({ markers: this.markerList.actives });
      next();
    });
  }

  execute() {
    this.middlewares();
    this.rest();
    this.sockets();
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    })
  }
}

module.exports = Server;
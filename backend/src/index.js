const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-kfe1s.mongodb.net/radar_dev?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(4000);
const express = require('express');
const app = express();
const jsonParser = require('body-parser').json;
const routes = require('./routes');
const logger = require('morgan');
const mongoose = require('mongoose');
const port = process.env.port || 8080;
const https = require('https');
const connect = require('connect');

const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

mongoose.connect('mongodb://localhost:27017/Drag');
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', err => {
  console.error('Error while connecting to DB: ${err.message}');
});
db.once('open', () => {
  console.log('DB connected successfully!');
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
    return res.status(200).json({});
  }
  next();
});


app.use(logger('dev'));
app.use(jsonParser());
app.use(connect.urlencoded());
//Auth Middleware-checks if the token is valid
app.all('/api/*', [require('./middlewares/validateRequest')]);
app.use('/', routes);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(port, () => {
  console.log(`Web server listening on: ${port}`);
});

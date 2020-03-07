const validateRequest = require('./middlewares/validateRequest');
const jsonParser = require('body-parser').json;
const winston = require('./config/winston');
const mongoose = require('mongoose');
const routes = require('./routes');
const connect = require('connect');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
var https = require('https');
var fs = require('fs');

var app = express();
app.use(helmet());

const options = {
  cert: fs.readFileSync('./middlewares/fullchain.pem'),
  key: fs.readFileSync('./middlewares/private.pem')
};

var httpsServer = https.createServer(options, app);

//{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } removes dependency on deprecated functions
mongoose.connect('mongodb+srv://drag_api:aTL4E9jasQWAwCc3@dragcluster-qgxyv.mongodb.net/Drag', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', err => {
  winston.error(`While connecting to DB: ${err.message}`);
});
db.once('open', () => {
  winston.info(`DB connected successfully!`);
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

// Custom token for logger to log request body
logger.token('body', function (req) {
  return JSON.stringify(req.body);
});
app.use(logger(':remote-addr | :method :url - :status | :user-agent | :response-time ms | :body', { stream: winston.stream }));
app.use(jsonParser());
app.use(connect.urlencoded());
//Auth Middleware-checks if the token is valid
app.all('/api/*', [validateRequest]);
app.use('/', routes);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  winston.error(`${req.ip} | ${req.method} ${req.originalUrl} - ${err.status || 500} | ${err.message}`);
  res.json({
    error: {
      message: err.message
    }
  });
});

httpsServer.listen(8443, () => {
  winston.info(`Web server listening on 8443!`);
});
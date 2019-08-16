const jsonParser = require('body-parser').json;
const routes = require('./routes');
const logger = require('morgan');
const mongoose = require('mongoose');
const connect = require('connect');
var https = require('https');
var fs = require('fs');

const options = {
  cert: fs.readFileSync('./middlewares/fullchain.pem'),
  key: fs.readFileSync('./middlewares/private.pem')
};

var express = require('express');
var app = express();

var httpsServer = https.createServer(options, app);


mongoose.connect('mongodb+srv://drag_api:aTL4E9jasQWAwCc3@dragcluster-qgxyv.mongodb.net/Drag');
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

httpsServer.listen(8443, () => {
  console.log(`Web server listening on: ${8443}`);
});
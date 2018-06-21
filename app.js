const express = require('express');
const jsonParser = require('body-parser').json;
const routes = require('./routes');
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/RAN_USERS');
const db = mongoose.connection;

db.on('error', err => {
	console.error('Error while connecting to DB: ${err.message}');
});
db.once('open',() => {
	console.log('DB connected successfully!');
});

const app = express();

app.use(logger('dev'));
app.use(jsonParser());
app.use('/users',routes);//check this to mount the router on the app

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`Web server listening on: ${port}`);
});

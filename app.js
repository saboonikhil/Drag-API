const express = require('express');
const jsonParser = require('body-parser').json;
const routes = require('./routes');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(jsonParser());
app.use('/users',routes);

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

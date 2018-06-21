const express = require('express');
const jsonParser = require('body-parser').json;
const routes = require('./routes');

const app = express();

app.use(jsonParser());
app.use('/users',routes);

const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`Web server listening on: ${port}`);
});

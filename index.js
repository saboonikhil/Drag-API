const express = require('express');

const app = express();

const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`Web server listening on: ${port}`);
});
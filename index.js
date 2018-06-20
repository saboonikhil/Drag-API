const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Server Test'))

app.listen(8080, () => console.log('Web Server listening on port 8080!'))
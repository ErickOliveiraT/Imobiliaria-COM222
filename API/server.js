const express = require('express');
const app = express();
require('dotenv').config();
 
app.get('/', function (req, res) {
  res.sendStatus(200);
})
 
const port = process.env.SERVER_PORT || 3000;
app.listen(port);
console.log('Server listening on port ', port);
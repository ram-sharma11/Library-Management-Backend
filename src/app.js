const express = require('express');
require("./configs/db")

const app = express();

// Use parsing middleware
app.use(express.json());

//   router 
app.use('/', require('./routes/index'));
app.all('/*', (req, res) =>  res.status(404).json({message:"Not Found"}))


module.exports = app;
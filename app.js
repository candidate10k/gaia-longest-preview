'use strict'
/*
  Gaia backend challenge exercise.

*/


const express = require('express')
const app = express()
const v1 = require('./routers/v1')

app.get('/', (req, res) => {
  res.send('App running')
})

//Maybe not needed for something this simple, but to me V1 = consider V2
app.use('/v1', v1);

const port = 3000;

app.listen(port, function () {
  console.log('listening on ' + port);
})

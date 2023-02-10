const express = require('express');
require('dotenv').config();
require('colors');

const connectDB = require('./config/db');

// connect database
connectDB();

//  init app
const app = express();

//  middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// listen to server
const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
      .underline.bgWhite
  )
);

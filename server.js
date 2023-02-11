const express = require('express');
require('dotenv').config();
require('colors');
const connectDB = require('./config/db');

// routes
const authRoutes = require('./routes/authRoute');
const usersRoutes = require('./routes/userRoute');
const postsRoutes = require('./routes/postRoute');
const commentRoutes = require('./routes/commentRoute');

// connect database
connectDB();

//  init app
const app = express();

//  middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentRoutes);

// listen to server
const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
      .underline.bgWhite
  )
);

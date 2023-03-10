const express = require('express');
require('dotenv').config();
require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// routes
const authRoutes = require('./routes/authRoute');
const usersRoutes = require('./routes/userRoute');
const postsRoutes = require('./routes/postRoute');
const commentRoutes = require('./routes/commentRoute');
const categoryRoutes = require('./routes/categoryRoute');

// connect database
connectDB();

//  init app
const app = express();

//  middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

// error middlewares
app.use(notFound);
app.use(errorHandler);

// listen to server
const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
      .underline.bgWhite
  )
);

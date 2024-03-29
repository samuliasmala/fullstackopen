const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const { MONGODB_URI } = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

mongoose.set('strictQuery', false);
logger.info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((err) => logger.error('error connecting to MongoDB:', err.message));

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

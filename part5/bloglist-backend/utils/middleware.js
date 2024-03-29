const logger = require('./logger');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET } = require('./config');

morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : null
);

const tinyWithBody =
  ':method :url :status :res[content-length] - :response-time ms :body';

const requestLogger = morgan(tinyWithBody, {
  skip: () => process.env.NODE_ENV === 'test',
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer '))
    req.token = authorization.replace('Bearer ', '');
  else req.token = null;

  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    req.user = null;
    return next();
  }

  const decodedToken = jwt.verify(req.token, SECRET);
  if (!decodedToken.id) return res.status(401).json({ error: 'token invalid' });
  const user = await User.findById(decodedToken.id);
  if (!user) return res.status(400).json({ error: 'user not found' });
  req.user = user;

  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: 'token missing or invalid' });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler,
};

const logger = require('./logger');
const morgan = require('morgan');

morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : null
);

const tinyWithBody =
  ':method :url :status :res[content-length] - :response-time ms :body';

const requestLogger = morgan(tinyWithBody);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};

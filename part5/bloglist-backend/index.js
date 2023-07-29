const app = require('./app');
const { PORT } = require('./utils/config');
const logger = require('./utils/logger');

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'development') {
    logger.info(`Test frontend: http://localhost:${PORT}`);
    logger.info(`Test API: http://localhost:${PORT}/api/blogs`);
  }
});

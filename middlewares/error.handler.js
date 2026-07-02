const logErrors = (err, req, res, next) => {
  console.error('[Error Handler Log]');
  console.error(err);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || 'internal Server Error';

  if (err.message.includes('not found')) {
    statusCode = 404;
  } else if (err.isJoi) {
    statusCode = 400;
  } else if (
    err.name === 'SequelizeValidationError' ||
    err.name === 'SequelizeUniqueConstraintError'
  ) {
    statusCode = 400;
    message = err.errors ? err.errors.map((e) => e.message) : err.message;
  }
  res.status(statusCode).json({
    statusCode,
    error: err.name || 'Error',
    message: message,
  });
};

export { logErrors, errorHandler };

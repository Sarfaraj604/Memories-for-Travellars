export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  if (Number.isInteger(err.status) && err.status >= 400 && err.status < 600) statusCode = err.status;
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'Image exceeds the 5MB upload limit.';
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle Mongoose CastError
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for ${field}. Please use another value.`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token expired';
  }

  const isDev = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    message: isDev ? err.message : message,
    stack: isDev ? err.stack : undefined,
    ...(isDev && { originalError: err.message })
  });
};

export default errorHandler;

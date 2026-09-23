const errorHandler = (err, req, res, next) => {
  console.error('🔥 [ERROR CAUGHT]:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server';

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;
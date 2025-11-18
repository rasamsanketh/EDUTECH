module.exports = (err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const payload = { success: false, message: err.message || 'Internal Server Error' };
  if (process.env.NODE_ENV !== 'production') {
    payload.error = err && err.stack ? err.stack : String(err);
  }
  res.status(status).json(payload);
};

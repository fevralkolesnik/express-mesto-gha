class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.errCode = 404;
  }
}

module.exports = CastError;

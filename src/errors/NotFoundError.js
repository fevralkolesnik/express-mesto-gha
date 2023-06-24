class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.errCode = 404;
  }
}

module.exports = NotFoundError;

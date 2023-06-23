class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.errCode = 401;
  }
}

module.exports = UnauthorizedError;

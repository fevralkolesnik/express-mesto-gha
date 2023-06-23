class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.errCode = 403;
  }
}

module.exports = ForbiddenError;

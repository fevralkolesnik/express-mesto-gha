class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.errCode = 400;
  }
}

module.exports = ValidationError;

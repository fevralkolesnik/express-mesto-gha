class DuplicateKeyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateKeyError';
    this.errCode = 409;
  }
}

module.exports = DuplicateKeyError;

class UnhandeledError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnhandeledError';
    this.errCode = 500;
  }
}

module.exports = UnhandeledError;

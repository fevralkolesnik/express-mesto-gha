class DocumentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DocumentNotFoundError';
    this.errCode = 404;
  }
}

module.exports = DocumentNotFoundError;

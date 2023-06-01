class CustomError extends Error {
  constructor(message, status, errors, ...params) {
    super(...params);
    this.status = status;
    this.message = message;
    this.errors = errors || '';
  }
}
module.exports = CustomError;

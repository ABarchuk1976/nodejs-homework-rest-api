class AppError extends Error {
  constructor(status, message) {
    const msg = Array.isArray(message) ? message.join(' ; ') : message;

    super(msg);
    this.status = status;
  }
}

module.exports = AppError;

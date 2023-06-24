// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { errCode, message } = err;
  res.status(errCode).send({ message });
};

module.exports = {
  errorHandler,
};

const { checkToken } = require('../utils/jwtAuth');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Пользователь не авторизован'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = checkToken(token);
    req.user = {
      _id: payload._id,
    };
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Пользователь не авторизован'));
  }
};

module.exports = {
  auth,
};

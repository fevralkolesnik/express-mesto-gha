const jwt = require('jsonwebtoken');

const SECRET_KEY = 'very-secret-key';

function signToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

function checkToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = {
  signToken,
  checkToken,
};

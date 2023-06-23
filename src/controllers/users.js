const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signToken } = require('../utils/jwtAuth');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnhandeledError = require('../errors/UnhandeledError');
const CastError = require('../errors/CastError');
const DuplicateKeyError = require('../errors/DuplicateKeyError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const duplicateKeyError = 11000;

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => {
      throw new UnhandeledError('Ошибка по-умолчанию');
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Пользователь по указанному _id не найден');
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new CastError('Передан невалидный _id');
      }
      throw new UnhandeledError('Ошибка по-умолчанию');
    })
    .catch((err) => {
      next(err);
    });
};

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new UnauthorizedError('Пользователь не авторизован');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => {
      throw new UnhandeledError('Ошибка по-умолчанию');
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      }
      if (err.code === duplicateKeyError) {
        throw new DuplicateKeyError('Пользователь с таким email уже существует');
      }
      throw new UnhandeledError('Ошибка по-умолчанию');
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, matched]) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      const token = signToken({ _id: user._id });
      res.status(200).send(token);
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      throw new UnhandeledError('Ошибка по-умолчанию');
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Переданы некорректные данные при обновлении пользователя');
      } else {
        throw new UnhandeledError('Ошибка по-умолчанию');
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateAvatarUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара');
      } else {
        throw new UnhandeledError('Ошибка по-умолчанию');
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getMyUser,
  createUser,
  login,
  updateUser,
  updateAvatarUser,
};

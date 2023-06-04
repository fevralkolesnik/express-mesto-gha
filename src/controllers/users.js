const mongoose = require('mongoose');
const User = require('../models/user');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnhandeledError = require('../errors/UnhandeledError');
const CastError = require('../errors/CastError');

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

  User.find({ _id: userId })
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

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      } else {
        throw new UnhandeledError('Ошибка по-умолчанию');
      }
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
  createUser,
  updateUser,
  updateAvatarUser,
};

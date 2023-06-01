const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(err => res.status(500).send({ message: "Ошибка по умолчанию." }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.find({_id: userId})
    .then(user => res.status(200).send({ data: user }))
    .catch(err => {
      if (!err.message.indexOf('Cast to ObjectId failed')) {
        res.status(404).send({message: 'Пользователь по указанному _id не найден.'})
      }
      else {
        res.status(500).send({ message: "Ошибка по умолчанию." })
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные при создании пользователя." })
      }
      else {
        res.status(500).send({ message: "Ошибка по умолчанию." })
      }
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
  .then(user => res.status(200).send({ data: user }))
  .catch(err => {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные при обновлении пользователя." })
    }
    if (!err.message.indexOf('Cast to ObjectId failed')) {
      res.status(404).send({message: 'Пользователь с указанным _id не найден.'})
    }
    else {
      res.status(500).send({ message: "Ошибка по умолчанию." })
    }
  });
};

const updateAvatarUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
  .then(user => res.status(200).send({ data: user }))
  .catch(err => {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные при обновлении аватара." })
    }
    if (!err.message.indexOf('Cast to ObjectId failed')) {
      res.status(404).send({message: 'Пользователь с указанным _id не найден.'})
    }
    else {
      res.status(500).send({ message: "Ошибка по умолчанию." })
    }
  });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatarUser
};
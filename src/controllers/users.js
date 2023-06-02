const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: res.message[500] }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.find({ _id: userId })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: res.message[404] });
      } else {
        res.status(500).send({ message: res.message[500] });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: res.message[400] });
      } else {
        res.status(500).send({ message: res.message[500] });
      }
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: res.message[400] });
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: res.message[404] });
      } else {
        res.status(500).send({ message: res.message[400] });
      }
    });
};

const updateAvatarUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: res.message[400] });
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: res.message[404] });
      } else {
        res.status(500).send({ message: res.message[500] });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatarUser,
};

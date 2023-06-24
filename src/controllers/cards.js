const mongoose = require('mongoose');
const Card = require('../models/card');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Доступ к ресурсу запрещен'));
      }
      return Card.deleteOne()
        .then(() => {
          res.status(200).send({ data: card });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new DocumentNotFoundError('Карточка с указанным _id не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Передан невалидный _id'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new DocumentNotFoundError('Передан несуществующий _id карточки'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Передан невалидный _id'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new DocumentNotFoundError('Передан несуществующий _id карточки'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Передан невалидный _id'));
      }
      return next(err);
    });
};

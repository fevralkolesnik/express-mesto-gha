const mongoose = require('mongoose');
const Card = require('../models/card');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnhandeledError = require('../errors/UnhandeledError');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      throw new UnhandeledError('Ошибка по-умолчанию');
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      } else {
        throw new UnhandeledError('Ошибка по-умолчанию');
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ data: card });
          });
      } else {
        throw new ForbiddenError('Доступ к ресурсу запрещен');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Карточка с указанным _id не найдена');
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new CastError('Передан невалидный _id');
      }
      if (err.name === 'ForbiddenError') {
        throw new ForbiddenError('Доступ к ресурсу запрещен');
      }
      throw new UnhandeledError('Ошибка по-умолчанию');
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Передан несуществующий _id карточки');
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

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Передан несуществующий _id карточки');
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

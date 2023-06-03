const mongoose = require('mongoose');
const Card = require('../models/card');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnhandeledError = require('../errors/UnhandeledError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      Error();
    })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Карточки не найдены');
      } else {
        throw new UnhandeledError('Ошибка по-умолчанию');
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
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

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      Error();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Карточка с указанным _id не найдена');
      } else {
        throw new UnhandeledError('Ошибка по-умолчанию');
      }
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
    .orFail(() => {
      Error();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Передан несуществующий _id карточки');
      } else {
        throw new UnhandeledError('Ошибка по-умолчанию');
      }
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
    .orFail(() => {
      Error();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Передан несуществующий _id карточки');
      } else {
        throw new UnhandeledError('Ошибка по-умолчанию');
      }
    })
    .catch((err) => {
      next(err);
    });
};

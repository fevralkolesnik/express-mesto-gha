const { celebrate, Joi } = require('celebrate');

const RegExpURL = /^(https?:\/\/(www\.)?)([-a-zA-Z0-9\W]){1,}/;

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegExpURL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(RegExpURL),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(RegExpURL),
  }),
});

module.exports = {
  validationUserId,
  validationCardId,
  validationCreateUser,
  validationLogin,
  validationUpdateUser,
  validationUpdateAvatar,
  validationCreateCard,
};

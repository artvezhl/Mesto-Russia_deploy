const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { linkValidator } = require('../utils/helpers');

router.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
}), getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
}), getUser);

router.patch('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
    cookie: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(linkValidator),
  }),
}), updateAvatar);

module.exports = router;

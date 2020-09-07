const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { userErrorsHandler } = require('../utils/helpers');
const NotFoundError = require('../errors/not-found-err');

// возврат всех пользователей
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

// возврат пользователя по _id
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      throw new NotFoundError(`Пользователь с номером ${req.params.userId} отсутствует`);
    }
    res.send(user);
  } catch (err) {
    userErrorsHandler(err, res, next);
  }
};

// создание нового пользователя
module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email,
    } = req.body;
    let password;
    let passwordLength;
    if (req.body.password) {
      passwordLength = req.body.password.split(' ').join('').length;
    }
    if (passwordLength > 7) {
      password = await bcrypt.hash(req.body.password, 10);
    }
    const newUser = await User.create({
      name, about, avatar, email, password,
    });

    const data = (object) => {
      const {
        name, about, avatar, email, ...rest
      } = object;

      return {
        name, about, avatar, email,
      };
    };

    res.send(data(newUser));
  } catch (err) {
    userErrorsHandler(err, res, next);
  }
};

// обновление профиля
module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedProfile = await
    User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true });
    res.send(updatedProfile);
  } catch (err) {
    userErrorsHandler(err, res, next);
  }
};

// обновление аватара
module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedAvatar = await
    User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true });
    res.send(updatedAvatar);
  } catch (err) {
    userErrorsHandler(err, res, next);
  }
};

// контроллер login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: foundUser._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .end(token);
  } catch (e) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;

    next(err);
  }
};

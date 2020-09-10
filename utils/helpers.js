const validator = require('validator');

const userErrorsHandler = (e, res, next) => {
  let err;
  if (e.name === 'ValidationError' || e.name === 'CastError') {
    err = new Error(e.message);
    err.statusCode = 400;
  }
  if (e.code === 11000) {
    err = new Error('Пользователь с такой почтой уже есть зарегистрирован');
    err.statusCode = 409;
  }
  if (e === 'NotValidCard') {
    err = new Error('Карточка с таким номером отсутствует');
    err.statusCode = 404;
  }
  if (e === 'NotValidUser') {
    err = new Error('Пользователь с таким номером отсутствует');
    err.statusCode = 404;
  }
  next(err);
};

const linkValidator = function (link) {
  return validator.isURL(link) ? link : new Error();
};

// функция для возврата данных пользователя без пароля
const dataWithoutPasswordReturn = (object) => {
  const {
    name,
    about,
    avatar,
    email,
  } = object;

  return {
    name, about, avatar, email,
  };
};

module.exports = { userErrorsHandler, linkValidator, dataWithoutPasswordReturn };

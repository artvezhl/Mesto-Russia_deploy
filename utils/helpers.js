const validator = require('validator');

const userErrorsHandler = (e, res, next) => {
  let err;
  if (e.name === 'ValidationError') {
    err = new Error(e.message);
    err.statusCode = 400;
  }
  if (e.code === 11000) {
    err = new Error('Пользователь с такой почтой уже есть зарегистрирован');
    err.statusCode = 409;
  }
  if (e.name === 'CastError') {
    err = new Error(e.message);
    err.statusCode = 400;
  }
  next(err);
};

const linkValidator = (link) => {
  return validator.isURL(link) ? link : new Error();
}

module.exports = { userErrorsHandler, linkValidator };

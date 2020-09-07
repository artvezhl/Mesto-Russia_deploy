const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();
const users = require('./routes/users.js');
const cards = require('./routes/cards.js');
const unfoundPage = require('./middlewares/unfound.js');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO проверить Eslint
// подключение к Mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// подключение логгера запросов
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(cookieParser());

// авторизация
app.use(auth);

// роуты к разным путям и несуществующему пути
app.use('/users', users);
app.use('/cards', cards);
app.use(unfoundPage);

// логгер ошибок
app.use(errorLogger);

// обработчики ошибок celebrate
app.use(errors());

// обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

// запуск сервера на локальном порте (по-умолчанию localhost:3000)
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

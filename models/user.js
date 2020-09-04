const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// создание экземпляра схемы с необходимыми полями
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'В поле "Имя" должно быть не менее 2 символов'],
    maxlength: [30, 'В поле "Имя" должно быть не более 30 символов'],
    required: [true, 'Поле "Имя" не является валидным. В нем должно быть от 2 до 30 символов'],
  },
  about: {
    type: String,
    minlength: [2, 'В поле "О себе" должно быть не менее 2 символов'],
    maxlength: [30, 'В поле "О себе" должно быть не более 30 символов'],
    required: [true, 'Поле "О себе" не является валидным. В нем должно быть от 2 до 30 символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
    required: [true, 'Поле "аватар" не является валидным'],
  },
  email: {
    type: String,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
    required: [true, 'Поле "email" не является валидным'],
    unique: [true, 'Пользователь с таким email уже зарегистрирован'],
  },
  password: {
    type: String,
    required: [true, 'В поле "password" должно быть не менее 8 символов'],
    select: false,
  },
});

// метод для проверки почты и пароля
userSchema.statics.findUserByCredentials = async function (email, password) {
  const foundUser = await this.findOne({ email }).select('+password');
  if (!foundUser) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }

  const comparesPassword = await bcrypt.compare(password, foundUser.password);
  if (!comparesPassword) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }

  return foundUser;
};

// создание модели пользователя
module.exports = mongoose.model('user', userSchema);

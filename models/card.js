const mongoose = require('mongoose');
const validator = require('validator');

// создание экземпляра схемы с необходимыми полями
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'В поле "Имя" должно быть не менее 2 символов'],
    maxlength: [30, 'В поле "Имя" должно быть не более 30 символов'],
    required: [true, 'Поле "Имя" не является валидным. В нем должно быть от 2 до 30 символов'],
  },
  link: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
    required: [true, 'В данном поле должна быть ссылка'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создание модели карточки
module.exports = mongoose.model('card', cardSchema);

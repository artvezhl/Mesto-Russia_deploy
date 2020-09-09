const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const { userErrorsHandler } = require('../utils/helpers');

// возврат всех карточек
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

// создание карточки
module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const newCard = await Card.create({ name, link, owner: req.user._id });
    res.send(newCard);
  } catch (err) {
    userErrorsHandler(err, res, next);
  }
};

// удаление карточки
module.exports.removeCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail('NotValidCard');
    let cardToRemove;

    if (req.user._id.toString() !== card.owner.toString()) {
      const authError = new Error(`У Вас отсутствуют права на удаление карточки ${req.params.cardId}`);
      authError.statusCode = 403;

      next(authError);
    } else {
      cardToRemove = await Card.findByIdAndRemove(req.params.cardId);
    }

    res.send(cardToRemove);
  } catch (err) {
    userErrorsHandler(err, res, next);
  }
};

// постановка лайка карточки
module.exports.likeCard = async (req, res, next) => {
  try {
    const cardToLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (cardToLike === null) {
      throw new NotFoundError(`Карточка с номером ${req.params.cardId} отсутствует`);
    }
    res.send(cardToLike);
  } catch (err) {
    userErrorsHandler(err, res, next);
  }
};

// снятие лайка карточки
module.exports.dislikeCard = async (req, res, next) => {
  try {
    const cardToDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (cardToDislike === null) {
      throw new NotFoundError(`Карточка с номером ${req.params.cardId} отсутствует`);
    }
    res.send(cardToDislike);
  } catch (err) {
    userErrorsHandler(err, res, next);
  }
};

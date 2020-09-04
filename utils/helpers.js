module.exports = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(400).send(err.message);
    return;
  }
  if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с такой почтой уже есть зарегистрирован' });
    return;
  }
  res.status(500).send({ message: 'На сервере произошла ошибка' });
};

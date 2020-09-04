const router = require('express').Router();

router.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });

  next();
});

module.exports = router;

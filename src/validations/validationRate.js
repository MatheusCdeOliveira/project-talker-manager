const validationRate = (req, res, next) => {
  const { rate } = req.body.talk;

  if (rate === undefined) {
   return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(rate) || !(rate >= 1 && rate < 6)) {
   return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = {
  validationRate,
};
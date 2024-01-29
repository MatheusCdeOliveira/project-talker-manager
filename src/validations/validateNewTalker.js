const processValidation = require('../utils/processValidation');

const validateTalker = (req, _res, next) => {
  const { name, age, talk } = req.body;

  const validations = [
    { condition: !name, message: 'O campo "name" é obrigatório' },
    { condition: name && name.length < 3, message: 'O "name" deve ter pelo menos 3 caracteres' },
    { condition: !age, message: 'O campo "age" é obrigatório' },
    { condition: age < 18, message: 'A pessoa palestrante deve ser maior de idade' },
    { condition: !talk, message: 'O campo "talk" é obrigatório' },
  ];
  
  processValidation(validations);
  next();
};

const validateTalkInfo = (req, _res, next) => {
  const { watchedAt, rate } = req.body.talk;
  const isFormatDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  const validations = [
    { condition: !watchedAt, message: 'O campo "watchedAt" é obrigatório' },
    { condition: !isFormatDate.test(watchedAt),
       message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' },
    { condition: rate === undefined, message: 'O campo "rate" é obrigatório' },
    { condition: !Number.isInteger(rate) || !(rate >= 1 && rate <= 5),
       message: 'O campo "rate" deve ser um inteiro de 1 à 5' },
  ];
  
  processValidation(validations);

  next();
};

module.exports = { validateTalker, validateTalkInfo };
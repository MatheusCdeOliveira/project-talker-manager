const CustomError = require('../middlewares/customError');

const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  const verifyEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) throw new CustomError('O campo "email" é obrigatório', 400);
  if (!verifyEmail.test(email)) {
    throw new CustomError(
      'O "email" deve ter o formato "email@email.com"',
      400,
    ); 
}

  if (!password) throw new CustomError('O campo "password" é obrigatório', 400);
  if (password.length < 6) {
    throw new CustomError('O "password" deve ter pelo menos 6 caracteres', 400);
  }

  next();
};

module.exports = {
  validateLogin,
};

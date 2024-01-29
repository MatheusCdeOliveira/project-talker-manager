const CustomError = require('./customError');

const auth = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization) throw new CustomError('Token não encontrado', 401);
  if (authorization.length < 16 || typeof authorization !== 'string') {
    throw new CustomError('Token inválido', 401);
  }

  next();
};

module.exports = auth;
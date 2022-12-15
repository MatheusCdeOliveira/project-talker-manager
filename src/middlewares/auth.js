const authentication = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16 || typeof authorization !== 'string') {
    res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

module.exports = {
  authentication,
};
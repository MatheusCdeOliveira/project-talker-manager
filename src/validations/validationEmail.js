const validationEmail = (req, res, next) => {
     const { email } = req.body;

    const verifyEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!email) {
     return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
     if (!verifyEmail.test(email)) {
      return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
     
     next();
};

module.exports = {
  validationEmail,
};
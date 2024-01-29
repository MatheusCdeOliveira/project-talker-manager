const CustomError = require('../middlewares/customError');

const processValidation = (validations) => {
  validations.forEach((validation) => {
    if (validation.condition) {
      throw new CustomError(validation.message, 400);
    }
  });
};

module.exports = processValidation;
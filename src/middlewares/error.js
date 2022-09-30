module.exports = (err, req, res, next) => {
  if (
    err.name === 'SequelizeValidationError' ||
    err.name === 'SequelizeUniqueConstraintError'
  ) {
    err.statusCode = 400;
    err.errors[0].message;
  }

  //   if (
  //     err.name === 'SequelizeValidationError' ||
  //     err.name === 'SequelizeUniqueConstraintError'
  //   ) {
  //     err.statusCode = 400;
  //     err.errors[0].message;
  //   }

  res.status(err.statusCode || 500).json({ message: err.message });
};

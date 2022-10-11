const AppError = require('../utils/appError');
module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new AppError('Unauthorized', 401);
    }
    next();
  } catch (err) {
    next(err);
  }
};

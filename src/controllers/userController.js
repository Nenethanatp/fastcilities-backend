exports.getUser = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user }); //req.user is  created by authenticate.js
  } catch (err) {
    next(err);
  }
};

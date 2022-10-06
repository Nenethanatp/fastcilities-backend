const cloudinary = require('../utils/cloudinary');
const { User } = require('../models');
const fs = require('fs');

exports.getUser = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user }); //req.user is  created by authenticate.js
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword, email, phone } =
      req.body;

    const file = req.file;
    let image = req.user.image;
    if (file) {
      const secureUrl = await cloudinary.upload(
        file.path,
        image ? cloudinary.getPublicId(image) : null
      );
      image = secureUrl;
    }

    await User.update({ image }, { where: { id: req.user.id } });

    fs.unlinkSync(file.path);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    next(err);
  }
};

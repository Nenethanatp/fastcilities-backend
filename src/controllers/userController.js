const cloudinary = require('../utils/cloudinary');
const { User } = require('../models');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

exports.getUser = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user }); //req.user is  created by authenticate.js
  } catch (err) {
    next(err);
  }
};

exports.checkPassword = async (req, res, next) => {
  try {
    const { oldPassword } = req.body;
    const { id } = req.user;
    const user = await User.findOne({
      where: { id: id },
      attributes: ['id', 'password'],
    });

    // {id:12, password: "erjoewvevorep"}
    console.log(oldPassword);
    const isCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isCorrect) {
      throw new AppError('Old password is incorrect', 400);
    }
    res.status(200).json({ message: 'correct' });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  const file = req.file;

  try {
    const updatedUser = req.body;
    let image = req.user.image;

    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 12);
    }

    if (file) {
      const secureUrl = await cloudinary.upload(
        file.path,
        image ? cloudinary.getPublicId(image) : null
      );
      updatedUser.image = secureUrl;
    }

    await User.update(updatedUser, { where: { id: req.user.id } });
    const user = await User.findOne({ where: { id: req.user.id } });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  } finally {
    if (file) {
      fs.unlinkSync(file.path);
    }
  }
};

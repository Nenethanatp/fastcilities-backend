const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const AppError = require('../utils/appError');
const { User } = require('../models');

const genToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY || 'private_key', {
    expiresIn: process.env.JWT_EXPIRES || '30d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const {
      studentId,
      password,
      confirmPassword,
      firstName,
      lastName,
      email,
      phone,
      faculty,
    } = req.body;

    if (!studentId || studentId.trim() === '') {
      throw new AppError('Student id is required', 400);
    }
    if (isNaN(studentId) || studentId.length !== 10) {
      throw new AppError('Student id is invalid format', 400);
    }
    if (!password || password.trim() === '') {
      throw new AppError('Password is required', 400);
    }
    if (!confirmPassword || confirmPassword.trim() === '') {
      throw new AppError('Confirm password is required', 400);
    }
    if (!firstName || firstName.trim() === '') {
      throw new AppError('First name is required', 400);
    }
    if (!lastName || lastName.trim() === '') {
      throw new AppError('Last name is required', 400);
    }
    if (!email || email.trim() === '') {
      throw new AppError('Email is required', 400);
    }
    if (!phone || phone.trim() === '') {
      throw new AppError('Phone number is required', 400);
    }
    if (!faculty || faculty.trim() === '') {
      throw new AppError('Faculty is required', 400);
    }
    if (String(password) !== String(confirmPassword)) {
      throw new AppError('Password and confirm password is not match', 400);
    }
    if (!validator.isEmail(String(email))) {
      throw new AppError('Email is invalid format', 400);
    }
    if (!validator.isMobilePhone(String(phone), 'th-TH')) {
      throw new AppError('Phone number is invalid format', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      studentId,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phone,
      faculty,
    });
    const token = genToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { studentId, password } = req.body;
    if (typeof studentId !== 'string' || typeof password !== 'string') {
      throw new AppError('Student id or password is invalid', 400);
    }
    const user = await User.findOne({
      where: {
        studentId: studentId,
      },
    });
    if (!user) {
      throw new AppError('Student id or password is invalid', 400);
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new AppError('Student id or password is invalid', 400);
    }

    const token = genToken({ id: user.id });
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
};

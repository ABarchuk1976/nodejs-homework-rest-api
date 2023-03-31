const jwt = require('jsonwebtoken');

const authValidator = require('../utils/authValidator');
const usersModel = require('../models/usersModel');
const ImageService = require('../services/imageService');

exports.checkEmail = async (req, res, next) => {
  const { email } = req.body;
  const checkEmail = await usersModel.isExists(email);

  if (checkEmail) {
    return res.status(409).json({
      message: `Email ${email} in use`,
    });
  }

  next();
};

exports.checkAuthUserData = (req, res, next) => {
  const { error } = authValidator.authUserDataValidator(req.body);

  if (error) {
    const { key } = error.details[0].context;

    return res.status(400).json({ message: `${key} missing or invalid` });
  }

  next();
};

exports.checkUserSubscription = (req, res, next) => {
  const { subscription } = req.body;

  const { error } = authValidator.authSubscriptionValidator({ subscription });

  if (error)
    return res.status(400).json({
      massage:
        'Do not valid subscription value. Set one of: starter, pro, business',
    });
  next();
};

exports.protect = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized',
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err.message);

    return res.status(401).json({
      message: 'Not authorized',
    });
  }

  const currentUser = await usersModel.getById(decoded.id);

  if (!currentUser) {
    return res.status(401).json({
      message: 'Not authorized',
    });
  }

  req.user = currentUser;

  next();
};

exports.updateAvatar = ImageService.upload('avatar');

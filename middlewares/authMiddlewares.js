const jwt = require('jsonwebtoken');

const authValidator = require('../utils/authValidator');
const User = require('../models/usersModel');

exports.checkSighupUserData = async (req, res, next) => {
  const { error, value } = authValidator.signupUserDataValidator(req.body);

  if (error) {
    const errorJoi = error.details[0].context.key;
    return res
      .status(400)
      .json({ message: `missing required "${errorJoi}" field` });
  }

  const checkEmail = await User.exists({ email: value.email });

  if (checkEmail) {
    return res.status(409).json({
      message: `Email ${value.email} in use`,
    });
  }

  req.body = value;

  next();
};

exports.protect = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1];

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

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return res.status(401).json({
      message: 'Not authorized',
    });
  }

  req.user = currentUser;

  next();
};

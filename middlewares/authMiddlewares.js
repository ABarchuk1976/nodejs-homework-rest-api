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

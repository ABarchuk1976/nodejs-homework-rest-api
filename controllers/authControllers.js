const jwt = require('jsonwebtoken');

const User = require('../models/usersModel');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.addUserController = async (req, res) => {
  const newUser = await User.create(req.body);

  const { id, email, subscription } = newUser;

  return res.status(201).json({ user: { email, subscription } });
};

exports.loginUserController = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  const passwordIsValid = user.checkPassword(password, user.password);

  if (!(user && passwordIsValid))
    return res.status(401).json({
      message: 'Email or password is wrong',
    });

  const { id, subscription } = user;

  const token = signToken(id);

  return res.status(200).json({ token, user: { email, subscription } });
};

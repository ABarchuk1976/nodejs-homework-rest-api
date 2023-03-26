const usersModel = require('../models/usersModel');

exports.addUserController = async (req, res) =>
  await res.status(201).json(usersModel.addUser(req.body));

exports.loginUserController = async (req, res) => {
  const user = await usersModel.loginUser(req.body);

  const { token, email, subscription } = user;

  if (!token)
    return res.status(401).json({
      message: 'Email or password is wrong',
    });

  req.user = user;

  return res.status(200).json({ token, user: { email, subscription } });
};

exports.logoutUserController = async (req, res) => {
  const { id } = req.user;

  const logoutUser = await usersModel.logoutUser(id);

  req.user = logoutUser;

  return res.sendStatus(204);
};

exports.currentUserController = (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });
};

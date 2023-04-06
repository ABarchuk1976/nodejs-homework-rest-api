const usersModel = require('../models/usersModel');
const ImageService = require('../services/imageService');

exports.addUserController = async (req, res) =>
  res.status(201).json(await usersModel.addUser(req.body));

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
  const { user } = req;

  user.token = null;

  await user.save();

  return res.sendStatus(204);
};

exports.currentUserController = (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });
};

exports.updateSubscriptionController = async (req, res) => {
  const { user } = req;
  const { subscription: newSubscription } = req.body;

  user.subscription = newSubscription;

  await user.save();

  const { email, subscription } = user;

  return res.status(200).json({ email, subscription });
};

exports.updateAvatarController = async (req, res) => {
  const { file, user } = req;

  if (file) {
    user.avatarURL = await ImageService.save(user.id, file, {
      width: 250,
      height: 250,
    });
  }

  const { avatarURL } = await user.save();

  return res.status(200).json({ avatarURL });
};

exports.verificationController = async (req, res) => {
  const { user } = req;

  user.verificationToken = null;
  user.verify = true;

  await user.save();

  res.status(200).json({
    message: 'Verification successful',
  });
};

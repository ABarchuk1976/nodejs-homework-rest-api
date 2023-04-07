const usersModel = require('../models/usersModel');
const sendEmail = require('../services/emailService');
const ImageService = require('../services/imageService');
const { authEmailValidator } = require('../utils/authValidator');

exports.addUserController = async (req, res) =>
  res.status(201).json(await usersModel.addUser(req.body));

exports.loginUserController = async (req, res) => {
  const user = await usersModel.loginUser(req.body);

  const { token, email, subscription } = user;

  if (!token)
    return res.status(401).json({
      message: 'Email or password is wrong',
    });

		if (!user?.verify) {
			return res.status(401).json({message: "Registration do not verified yet."});
		}

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

exports.sendEmailController = async (req, res) => {

	if (!req.body.email) return res.status(400).json({"message": "missing required field email"});

	const {email} = req.body;

	const {error} = authEmailValidator({email});

	if (error) return res.status(400).json({message: "field email is not valid"});

	const user = await usersModel.getByEmail(email);

	const { verify, verificationToken } = user;

	if (verify) return res.status(400).json({
		message: "Verification has already been passed"
	});

    const subject = `For verification your registration.`;
    const html = `<strong> Follow the link: </strong><a href="localhost:3000/api/users/verify/${verificationToken}" target="_blank" rel="noopener noreferrer">localhost:3000/api/users/verify/${verificationToken}</a>`;

    await sendEmail({ to: email, subject, html });

		return res.status(200).json({
			"message": "Verification email sent"
		});
}

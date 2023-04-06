const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');
const uuid = require('uuid').v4;

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Duplicated email'],
      lowercase: true,
      trim: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: String,
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
			default: null,
    },
  },
  { versionKey: false }
);

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}?s=250&d=identicon`;
  }

  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

const User = mongoose.model('user', userSchema);

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.addUser = async (body) => {
  try {
    body.verificationToken = uuid();

    const newUser = await User.create(body);

		console.log("NEW USER: ", newUser);

    const { email, subscription, verificationToken } = newUser;

    const subject = `For verification your registration.`;
    const html = `<strong> Follow the link: </strong><a href="localhost:3000/api/users/verify/${verificationToken}" target="_blank" rel="noopener noreferrer">localhost:3000/api/users/verify/${verificationToken}</a>`;

    await sendEmail({ to: email, subject, html });

		
    return { user: { email, subscription } };
  } catch (error) {
    console.log(error);
  }
};

exports.loginUser = async (body) => {
  try {
    const { email, password } = body;
    const logonUser = await User.findOne({ email }).select('+password');

    const passwordIsValid = await logonUser?.checkPassword(
      password,
      logonUser.password
    );

    if (!(logonUser && passwordIsValid)) return { token: null, user: null };

    const { id } = logonUser;

    const token = signToken(id);

    const user = await User.findByIdAndUpdate(id, { token }, { new: true });

    return user;
  } catch (error) {
    console.log(error);
  }
};

exports.isExists = async (email) => {
  try {
    return await User.exists({ email });
  } catch (error) {
    console.log(error);
  }
};

exports.getById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.log(error);
  }
};

exports.getByVerificationToken = async (token) => {
  try {

		const user = await User.findOne({ verificationToken: token });

		console.log("USER: ", user);

    return user;
  } catch (error) {
    console.log(error);
  }
};

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userSchema.pre('save', async function (next) {
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
    const newUser = await User.create(body);

    const { email, subscription } = newUser;

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

    console.log('User in usersModel: ', user);

    return user;
  } catch (error) {
    console.log(error);
  }
};

exports.logoutUser = async (id) => {
  try {
    return await User.findByIdAndUpdate(id, { token: null }, { new: true });
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

exports.updateSubscription = async (userId, subscription) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    ).select('-__v');
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

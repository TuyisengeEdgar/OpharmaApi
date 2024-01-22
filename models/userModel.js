const crypto = require('crypto');
const mongoose = require('mongoose');
const { default: validator } = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Provide your e-mail'],
    lower: true,
    unique: true,
    validate: [validator.isEmail, 'Please tell us a valid e-mail'],
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'pharmacy', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Provide your password'],
    minLength: 8,
    selected: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetExpires: Date,
  passwordResetToken: String,
});
userSchema.pre('save', async function (next) {
  console.log(this.role);
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this point to the current query
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestap) {
  if (this.passwordChangedAt) {
    const changedTimestap = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestap < changedTimestap;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

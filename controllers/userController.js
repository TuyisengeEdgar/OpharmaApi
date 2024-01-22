/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Users/Edgar/Desktop/opharma/api/public/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.updateUserPhoto = upload.single('photo');
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = factory.getAll(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error intarnal server',
    message: 'this routes is not define yet',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // 1)create error if user POST passwords data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'this route is not for update the password.Please use updateMyPassword',
        400,
      ),
    );
  // 2) Filtered out fields unwanted containing to be update
  const filterBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterBody.photo = req.file.filename;

  // 3)update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.modifierUser = (req, res) => {
  res.status(500).json({
    status: 'error intarnal server',
    message: 'this routes is not define yet',
  });
};
// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error intarnal server',
//     message: 'this routes is not define yet',
//   });
// };

exports.getUser = factory.getOne(User);
// DO NOT UPDATE PASSWORD WITH THIS
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

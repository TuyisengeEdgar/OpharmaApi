const multer = require('multer');
const Medicine = require('../models/medicinesModel');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Users/Edgar/Desktop/opharma/api/public/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `med-${req.params.id}-${Date.now()}.${ext}`);
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

exports.updateMedecinImage = upload.single('image');

exports.getAllMedicines = async (req, res, next) => {
  try {
    const features = new APIFeatures(Medicine.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const medicines = await features.query;
    res.status(200).json({
      status: 'success',
      length: medicines.length,
      data: {
        medicines,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'not found!!!!',
    });
  }
};
exports.createMedicines = factory.createOne(Medicine, 'pharmacy');

exports.deleteMedicines = async (req, res, next) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Id not found',
    });
  }
};
exports.getMedicines = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        medicine,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.modifyMedicines = async (req, res, next) => {
  try {
    const medicin = await Medicine.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({
      status: 'success',
      data: {
        medicin,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

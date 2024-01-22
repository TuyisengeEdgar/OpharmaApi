const mongoose = require('mongoose');

const medicinesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, 'A medicin must have name'],
    },
    image: String,
    description: {
      type: String,
      minLength: [10, 'description must be greater than 10'],
      maxLength: [100, 'description must be less than 100'],
    },
    category: {
      type: String,
      required: [true, 'A medicine must have a category'],
    },
    manufacture: String,
    price: Number,
    prescription: {
      type: Boolean,
      default: false,
    },
    expirationDate: {
      type: Date,
      required: [true, 'needs expiration date'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'priceDiscount ({VALUE}) must be less than the regular price',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    pharmacy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Pharma',
        required: [true, 'medicines must belong to a pharmacy'],
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

medicinesSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'pharmacy',
    // select: '-__v -passwordChangedAt -password',
  });
  next();
});

const Medicine = mongoose.model('medecins', medicinesSchema);
module.exports = Medicine;

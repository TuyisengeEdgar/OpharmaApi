const mongoose = require('mongoose');

const pharmacieSchema = new mongoose.Schema({
  entrepriseName: {
    type: String,
    unique: true,
  },
  avaliserName: String,
  slug: String,
  dayOpen: String,
  NIF: {
    type: Number,
    min: 8,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
  startLocation: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  location: [
    {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
});

pharmacieSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt -password',
  });
  next();
});

const Pharmacy = mongoose.model('Pharma', pharmacieSchema);

module.exports = Pharmacy;

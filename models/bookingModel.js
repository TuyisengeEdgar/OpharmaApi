const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  medecinName: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
  entrepriseName: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancered'],
    default: 'pending',
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'medicin',
  }).populate({
    path: 'user',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

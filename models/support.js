const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Support need firstName'],
  },
  lastName: {
    type: String,
    required: [true, 'Support need firstName'],
  },
  email: {
    type: String,
    required: [
      true,
      'make sure you provide a valide email which we ca rich you',
    ],
  },
  description: {
    type: String,
    required: [true, 'please send your problem!!'],
  },
});

const Support = mongoose.model('Support', supportSchema);

module.exports = Support;

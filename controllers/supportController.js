const Support = require('../models/support');
const factory = require('./handlerFactory');

exports.createSupport = factory.createOne(Support);
exports.getAllSupport = factory.getAll(Support);
exports.deleteSupport = factory.deleteOne(Support);
exports.getSupport = factory.getOne(Support);

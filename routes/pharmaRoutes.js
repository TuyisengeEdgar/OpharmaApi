const express = require('express');
const pharmaController = require('../controllers/pharmaController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    // authController.restrictTo('admin', 'pharmacy'),
    pharmaController.getAllPharmacies,
  )
  .post(authController.protect, pharmaController.createPharmacy);

router
  .route('/:pharmaId')
  .get(authController.protect, pharmaController.getPharmacie)
  .delete(
    authController.protect,
    authController.restrictTo('admin, pharmacy'),
    pharmaController.deletePharma,
  );

router
  .route('/pharmacy-within/:distance/center/:latlng/unit/:unit')
  .get(pharmaController.getPharmacy_within);

// route("/:id").get(pharmaController.)

module.exports = router;

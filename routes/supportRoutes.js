const express = require('express');
const supportRoute = require('../controllers/supportController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    supportRoute.getAllSupport,
  )
  .post(
    authController.protect,
    authController.restrictTo('user', 'pharmacy'),
    supportRoute.createSupport,
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    supportRoute.getSupport,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    supportRoute.deleteSupport,
  );

module.exports = router;

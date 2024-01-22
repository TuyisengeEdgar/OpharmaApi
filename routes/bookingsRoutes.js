const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use(authController.protect);

router.get(
  '/checkout-session/:medicineId',
  bookingController.getCheckoutSession,
);

router.post('/payment', bookingController.createPayment);
// router.use(authController.restrictTo('admin', 'pharmacy'));

router
  .route('/')
  .get(bookingController.getAllBokings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;

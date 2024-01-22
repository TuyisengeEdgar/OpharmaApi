/* eslint-disable import/order */
const express = require('express');
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
// eslint-disable-next-line import/no-extraneous-dependencies

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.updateUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);
router.get('/:userId/bookings', bookingController.getBookingPerUser);
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .patch(userController.modifierUser)
  .delete(userController.deleteUser);

module.exports = router;

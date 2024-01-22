const Stripe = require('stripe');
const factory = require('./handlerFactory');
const Booking = require('../models/bookingModel');

const stripe = Stripe(
  'sk_test_51NxDhHE3DY1mh6Re0s6dytxrj04RYzalDDQA1b2ZhCqlXqxh9OPPY69BXyntlH7ovblATTyo6vZ52aBg01CBADZZ00SkbbsdLr',
);
const Medicine = require('../models/medicinesModel');
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1)Get the currently booked medicines
  console.log(req.params.medicineId);
  const medecine = await Medicine.findById(req.params.medicineId);
  // 2)create the checkout session and then send to the client

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   success_url: `${req.protocol}://${req.get('host')}/`,
  //   cancel_url: `${req.protocol}://${req.get('host')}/medicin/${
  //     medecine.medecineID
  //   }`,
  //   customer_email: req.user.email,
  //   client_reference_id: req.params.tourId,
  //   line_items: [
  //     {
  //       // name: `${medecine.name}`,
  //       description: medecine.description,
  //       images: [
  //         'https://img.freepik.com/vecteurs-libre/concept-realiste-emballage-bouteille-vitamine-illustration-vectorielle-symboles-d3_1284-70177.jpg?w=900&t=st=1696551712~exp=1696552312~hmac=c8f6103d84f782e633b43b5d71f31d4df35873f7ade19a27951ba3c200e76151',
  //       ],
  //       // price: 45 * 100,
  //       // currency: 'usd',
  //       quantity: 1,
  //     },
  //   ],
  // });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: medecine.name,
            images: [''],
            description: medecine.description,
          },
          unit_amount: medecine.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:5173/homepage',
    cancel_url: 'http://localhost:5173/homepage',
  });

  //  3)create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
exports.createPayment = catchAsync(async (req, res, next) => {
  const { price } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: 'usd',
    payment_method_types: ['card'],
  });
  const clientSecret = paymentIntent.client_secret;

  res.status(200).json({
    clientSecret,
  });
});

exports.getAllBokings = factory.getAll(Booking, 'medecin user');
exports.updateBooking = factory.updateOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getBookingPerUser = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.params.userId });
  console.log('shfieifsiodjoa');
  res.status(200).json({
    bookings,
  });
});

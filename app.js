/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const medicinRouter = require('./routes/medicinesRoutes');
const pharmacyRouter = require('./routes/pharmaRoutes');
const userRouter = require('./routes/userRoutes');
const supportRouter = require('./routes/supportRoutes');
const bookingRouter = require('./routes/bookingsRoutes');

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// if (process.env.NODE_ENV === 'development') {
// }
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
// Assuming you have stored the image using Multer
app.use(`${__dirname}/public`, express.static(`${__dirname}/public`));

app.get('/api/images/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = `public/${filename}`;
  res.sendFile(imagePath, { root: __dirname });
});
app.use('/api/v1/medecins', medicinRouter);
app.use('/api/v1/pharmacy', pharmacyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/support', supportRouter);
app.use('/api/v1/bookings', bookingRouter);

module.exports = app;

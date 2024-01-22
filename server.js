const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UnCaught excception Error 🔥');
});

dotenv.config({ path: './.config.env' });
console.log(process.env.NODE_ENV);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection established successfully');
  });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`server running on Port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandler Rejection Error 🔥');

  server.close(() => {
    process.exit(1);
  });
});

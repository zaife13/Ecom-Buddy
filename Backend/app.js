const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const HttpError = require('./utils/httpError');
const errorHandlerGlobal = require('./utils/errorHandler');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
require('./controllers/google');
const supplierRouter = require('./routes/supplierRoutes');
const app = express();

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(express.json());
//app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use(cors());

// used for logging the requests.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---- ROUTES ------ //

/* Mounting the router on the routes */

app.use('/ecomm/users', userRouter);
app.use('/ecomm/products', productRouter);
app.use('/ecomm/suppliers', supplierRouter);

// Invalid routes
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find the ${req.originalUrl} route.`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new HttpError(`Can't find the ${req.originalUrl} route.`, 404));
});
app.use(errorHandlerGlobal);
module.exports = app;

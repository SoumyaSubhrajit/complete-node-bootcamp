const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');
const rateLimit = require('express-rate-limit');
//This is a middle-ware it will in the middle of req and res.
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp');

// ADDITONAL SECURITYIN HEADER..
app.use(helmet());
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Data sanitization against NoSQL query injextion..
app.use(mongoSanitize());
// Data sanitization against XSS.
app.use(xss())

// clear-up the queryString..
app.use(hpp({
  whitelist: [
    'default',
    'price',
    'mazGroupSizw'
  ]
}))


// API LIMITING..
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'You are pass the limit of incoming request! try again later.'
})
app.use('/api', limit)

app.use(express.json({ limit: '10kb' }));
// This will a simple route system to get their..
app.use(express.static(`${__dirname}/public`))

// app.get('/', (req, res) => {
//   res.status(200).json({
//     firstName: "Soumya",
//     middleName: "Subhrajit",
//     lastName: "bag",
//     age: 20
//   })
// })

// if (!tour) {
//   return res.status(404).json({
//     status: 'fail',
//     message: "Invalid ID"
//   })
// }



// Global-Middle-ware....
/*
app.use((req, res, next) => {
  console.log("Hi, from the middle-ware.");
  req.requestTime = new Date().toISOString();
  next();
})
*/

//////////////////////////////////////
// old style of doing routes..

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTours)
// // Create a tour..
// app.post('/api/v1/tours', createTours)
// // Update the DB....
// app.patch('/api/v1/tours/:id', updateTours)
// // Delete id from the DB....
// app.delete('/api/v1/tours/:id', deleteTours)

/////////////////////////////////////////////////


// Mounting using middle-wire..
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



app.all('*', (req, res, next) => {

  // It have the 2 parameter one for the message and another one for the statusCode...
  next(new AppError(`Can't find the ${req.originalUrl} rout in the server!`))
})


// GLOBAL ERROR HANDLING MIDDLEWARE.
app.use(globalErrorHandler)

module.exports = app;
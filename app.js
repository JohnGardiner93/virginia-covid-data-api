////////////////////////////////////////////
// Modules
const express = require('express');
const morgan = require('morgan');

const regionRouter = require('./routes/regionRoutes');
const ageGroupRouter = require('./routes/ageGroupRoutes');
const reportRouter = require('./routes/reportRoutes');

const app = express();

////////////////////////////////////////////
// Middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

////////////////////////////////////////////
// Routes
app.use('/api/v1/regions', regionRouter);
app.use('/api/v1/age-groups', ageGroupRouter);
app.use('/api/v1/reports', reportRouter);

module.exports = app;

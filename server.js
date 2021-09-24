////////////////////////////////////////////
// MODULES
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();

////////////////////////////////////////////
// SETUP
// Environment Variables
dotenv.config(); //Read .env
dotenv.config({ path: './config.env' });

// Server Config
const port = process.env.PORT || 3000;

// DB Setup
const DB = process.env.DB_STRING.replace(`{%USER%}`, process.env.USER).replace(
  '{%PASSWORD%}',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindandModify: false,
  })
  .then(console.log('I did it'));

////////////////////////////////////////////
// SERVER
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

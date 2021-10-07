////////////////////////////////////////////
// MODULES
const dotenv = require('dotenv');
// Environment Variables
dotenv.config(); //Read .env
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = express();
const updateDB = require('./utils/getLatestData.js');

////////////////////////////////////////////
// SETUP
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
  .then(console.log('DB Connection Successful'));

////////////////////////////////////////////
// SERVER
app.listen(port, () => {
  console.log(`Server started on port ${port}`);

  // updateDB();
  // TODO: Add promise to call update DB once per day.
});

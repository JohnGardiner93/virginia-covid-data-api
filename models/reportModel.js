////////////////////////////////////////////
// Modules
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  report_date: {
    type: Date,
    required: [true, 'A report must have a report_date'],
  },
  health_district: {
    type: String,
    required: [true, 'A report must have a health_district'],
    trim: true,
  },
  age_group: {
    type: String,
    required: [true, 'A report must have a age_group'],
    enum: {
      values: [
        '0-9 Years',
        '10-19 Years',
        '20-29 Years',
        '30-39 Years',
        '40-49 Years',
        '50-59 Years',
        '60-69 Years',
        '70-79 Years',
        '80+ Years',
      ],
      message: 'Not a valid age group. See documentation.',
    },
  },
  number_of_cases: {
    type: Number,
    required: [true, 'A report must have a number_of_cases'],
  },
  number_of_hospitalizations: {
    type: Number,
    required: [true, 'A report must have a number_of_hospitalizations'],
  },
  number_of_deaths: {
    type: Number,
    required: [true, 'A report must have a number_of_deaths'],
  },
});

reportSchema.virtual('case_fatality_ratio').get(function () {
  const ratio = this.number_of_cases / this.number_of_deaths;
  return Number(ratio.toPrecision(1));
});

reportSchema.index(
  { report_date: 1, health_district: 1, age_group: 1 },
  { unique: true }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;

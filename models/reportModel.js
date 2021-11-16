////////////////////////////////////////////
// Modules
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportDate: {
    type: Date,
    required: [true, 'A report must have a reportDate'],
  },
  healthDistrict: {
    type: String,
    required: [true, 'A report must have a healthDistrict'],
    trim: true,
  },
  ageGroup: {
    type: String,
    required: [true, 'A report must have a ageGroup'],
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
  numberOfCases: {
    type: Number,
    required: [true, 'A report must have a numberOfCases'],
  },
  numberOfHospitalizations: {
    type: Number,
    required: [true, 'A report must have a numberOfHospitalizations'],
  },
  numberOfDeaths: {
    type: Number,
    required: [true, 'A report must have a numberOfDeaths'],
  },
});

reportSchema.virtual('case_fatality_ratio').get(function () {
  const ratio = this.numberOfCases / this.numberOfDeaths;
  return Number(ratio.toPrecision(1));
});

reportSchema.index(
  { reportDate: 1, healthDistrict: 1, ageGroup: 1 },
  { unique: true }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;

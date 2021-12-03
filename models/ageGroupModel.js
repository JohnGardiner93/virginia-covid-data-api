/////////////////////////////////////////////
// TODO: Consider making the virtual properties not virtual so that they can be queried.

////////////////////////////////////////////
// Modules
const mongoose = require('mongoose');

////////////////////////////////////////////
const ageGroupSchema = new mongoose.Schema(
  {
    ageGroup: {
      type: String,
      required: [true, 'Must have an ageGroup'],
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
          'Missing',
          'Other',
        ],
        message: 'Not a valid age group. See documentation.',
      },
    },
    regionData: [
      {
        region: { type: String, required: true },
        numberOfCases: { type: Number, required: true },
        numberOfHospitalizations: { type: Number, required: true },
        numberOfDeaths: { type: Number, required: true },
      },
    ],
    numberOfCases: {
      type: Number,
      required: [true, 'Must have a numberOfCases'],
    },
    numberOfHospitalizations: {
      type: Number,
      required: [true, 'Must have a numberOfHospitalizations'],
    },
    numberOfDeaths: {
      type: Number,
      required: [true, 'Must have a numberOfDeaths'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ageGroupSchema.virtual('caseFatalityRatio').get(function () {
  const ratio = this.numberOfCases / this.numberOfDeaths;
  return Number(ratio.toPrecision(1));
});

ageGroupSchema.virtual('caseHospitalizationRatio').get(function () {
  const ratio = this.numberOfCases / this.numberOfHospitalizations;
  return Number(ratio.toPrecision(1));
});

ageGroupSchema.virtual('hospitalizationFatalityRatio').get(function () {
  const ratio = this.numberOfHospitalizations / this.numberOfDeaths;
  return Number(ratio.toPrecision(1));
});

ageGroupSchema.index({ ageGroup: 1 }, { unique: true });

const ageGroup = mongoose.model('ageGroup', ageGroupSchema);

module.exports = ageGroup;

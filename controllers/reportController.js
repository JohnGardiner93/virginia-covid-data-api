////////////////////////////////////////////
// Modules
const Report = require('./../models/reportModel');
const APIFeatures = require('./../utils/apiFeatures');
////////////////////////////////////////////
// Route Handlers

exports.getAllReports = async (req, res, next) => {
  try {
    // console.log(req.body);

    const features = new APIFeatures(Report.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const reports = await features.query;

    res.status(200).json({
      status: 'success',
      length: reports.length,
      data: {
        reports,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Could not retrieve reports: ${error.message}`,
    });
  }
};

exports.createReport = async (req, res) => {
  try {
    // console.log(req.body);
    const newReport = await Report.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        report: newReport,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: `Report entry creation failed: ${error.message}`,
    });
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        report: report,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Report retreival failed: ${error.message}`,
    });
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        report: report,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: `Report update failed: ${error.message}`,
    });
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    await Report.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Report not deleted: ${error.message}`,
    });
  }
};

exports.deleteAllReports = async (req, res, next) => {
  try {
    await Report.deleteMany({});
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Report not deleted: ${error.message}`,
    });
  }
};

exports.aggregateAgeGroups = async (req, res, next) => {
  try {
    // console.log(req.body);
    const ageGroups = await Report.aggregate([
      {
        $bucket: {
          groupBy: '$ageGroup',
          boundaries: [
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
          default: 'Other',
          output: {
            regionData: {
              $push: {
                region: '$region',
                numberOfCases: '$numberOfCases',
                numberOfHospitalizations: '$numberOfHospitalizations',
                numberOfDeaths: '$numberOfDeaths',
                hospitalizationRate: {
                  $round: [
                    {
                      $divide: ['$numberOfHospitalizations', '$numberOfCases'],
                    },
                    +process.env.DECIMAL_PLACES,
                  ],
                },
                deathPerHospitalizationRate: {
                  $round: [
                    {
                      $divide: ['$numberOfDeaths', '$numberOfHospitalizations'],
                    },
                    +process.env.DECIMAL_PLACES,
                  ],
                },
                deathPerCaseRate: {
                  $round: [
                    { $divide: ['$numberOfDeaths', '$numberOfCases'] },
                    +process.env.DECIMAL_PLACES,
                  ],
                },
              },
            },
            numberOfCases: { $sum: '$numberOfCases' },
            numberOfHospitalizations: { $sum: '$numberOfHospitalizations' },
            numberOfDeaths: { $sum: '$numberOfHospitalizations' },
          },
        },
      },
      // {
      //   $addFields: {
      //     hospitalizationRate: {
      //       $round: [
      //         { $divide: ['$numberOfHospitalizations', '$numberOfCases'] },
      //         +process.env.DECIMAL_PLACES,
      //       ],
      //     },
      //     deathPerHospitalizationRate: {
      //       $round: [
      //         { $divide: ['$numberOfDeaths', '$numberOfHospitalizations'] },
      //         +process.env.DECIMAL_PLACES,
      //       ],
      //     },
      //     deathPerCaseRate: {
      //       $round: [
      //         { $divide: ['$numberOfDeaths', '$numberOfCases'] },
      //         +process.env.DECIMAL_PLACES,
      //       ],
      //     },
      //   },
      // },
      // {
      //   $sort: { ageGroup: -1 },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      length: ageGroups.length,
      data: {
        ageGroups,
      },
    });
    next();
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Could not retrieve reports: ${error.message}`,
    });
  }
};

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

    res.status(201).json({
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
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined (getReport)',
  });
};

exports.updateReport = async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined (updateReport)',
  });
};

exports.deleteReport = async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined (deleteReport)',
  });
};

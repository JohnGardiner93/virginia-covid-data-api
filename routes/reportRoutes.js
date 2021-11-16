////////////////////////////////////////////
// Modules
const express = require('express');
const reportController = require('./../controllers/reportController.js');

////////////////////////////////////////////
// Routes
const router = express.Router();

// '/api/v1/reports'
router
  .route('/')
  .get(reportController.getAllReports)
  .post(reportController.createReport);

router.route('/age-groups').get(reportController.aggregateAgeGroups);

router
  .route('/:id')
  .get(reportController.getReport)
  .patch(reportController.updateReport)
  .delete(reportController.deleteReport);

module.exports = router;

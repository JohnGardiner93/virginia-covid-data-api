////////////////////////////////////////////
// Modules
const express = require('express');
const regionController = require('./../controllers/regionController.js');

////////////////////////////////////////////
// Routes
const router = express.Router();

// '/api/v1/regions'
router.route('/').get(regionController.getAllRegions);
router.route('/total').get(regionController.getTotalStats);
router.route('/list').get(regionController.getRegionNameList);
router.route('/:id').get(regionController.getRegion); // Must be last. Otherwise, total and list will be treated as ID's

module.exports = router;

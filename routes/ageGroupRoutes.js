////////////////////////////////////////////
// Modules
const express = require('express');
const ageGroupController = require('./../controllers/ageGroupController.js');

////////////////////////////////////////////
// Routes
const router = express.Router();

// '/api/v1/ageGroups'
router.route('/').get(ageGroupController.getAllAgeGroups);
router.route('/total').get(ageGroupController.getTotalStats);
router.route('/list').get(ageGroupController.getAgeGroupNameList);
router.route('/:id').get(ageGroupController.getAgeGroup); // Must be last. Otherwise, total and list will be treated as ID's

module.exports = router;

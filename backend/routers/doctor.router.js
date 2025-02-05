const express = require('express');
const router = express.Router();
const {searchDoctors} = require('../controller/doctor.controller');

// Define the search endpoint
router.get('/search',searchDoctors);

module.exports = router;
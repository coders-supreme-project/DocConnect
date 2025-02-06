const express = require('express');
const Router = express.Router();
const { searchDoctors } = require('../Controller/doctor.controller');

// Define the search endpoint with specialization as a route parameter
Router.get('/search', searchDoctors);

module.exports = Router;
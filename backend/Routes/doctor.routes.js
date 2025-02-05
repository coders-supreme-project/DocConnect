const express = require('express');
const Router = express.Router();
const {searchDoctors} = require('../controller/doctor.controller');

// Define the search endpoint
Router.get('/search',searchDoctors);

module.exports = Router;
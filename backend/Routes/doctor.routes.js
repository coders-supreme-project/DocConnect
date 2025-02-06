const express = require('express');
const Router = express.Router();
const {searchDoctors,getLocationDoctors} = require('../controller/doctor.controller');

// Define the search endpoint
Router.get('/search',searchDoctors);
Router.post('/location',getLocationDoctors);

module.exports = Router;
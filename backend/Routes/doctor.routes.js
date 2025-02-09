const express = require('express');
const Router = express.Router();
const {searchDoctors,getLocationDoctors,getDoctorById} = require('../Controller/doctor.controller');

// Define the search endpoint
Router.get('/search',searchDoctors);
Router.post('/location',getLocationDoctors);
Router.get('/:id',getDoctorById)

module.exports = Router;
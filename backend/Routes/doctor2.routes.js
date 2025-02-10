const express = require('express');
const Router = express.Router();
const {searchDoctors,getLocationDoctors,getDoctorById} = require('../Controller/doctor.controller');
const {getDoctorbySpeciality} = require('../controller/doctor2.controller');


// Define the search endpoint

Router.get('/special',getDoctorbySpeciality);



module.exports = Router;
const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctor.controller');




router.post('/location',doctorController.getLocationDoctors);






module.exports = router;

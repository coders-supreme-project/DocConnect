const express = require('express');
const router = express.Router();
const {
  createAvailability,
  getDoctorAvailability,
  deleteAvailability,
  getAvailableSlots,
} = require("../controller/availability.controller");

router.post('/availability', createAvailability);

router.get('/availability/:DoctorID', getDoctorAvailability);

router.delete('/availability/:AvailabilityID', deleteAvailability);

router.get('/slots/:DoctorID', getAvailableSlots);

module.exports = router;
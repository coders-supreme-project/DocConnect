const express = require("express");
const router = express.Router();
const { register, login, session } = require("../Controller/user.controller");
const { authenticate } = require("../middleware/auth.middelware");

// Register Doctor or Patient
router.post("/register", register);

// Check if the authenticated user is a Doctor
router.get('/check-doctor', authenticate, (req, res) => {
  res.json({ isDoctor: req.user.role === 'Doctor' });
});

// Check if the authenticated user is a Patient
router.get('/check-patient', authenticate, (req, res) => {
  res.json({ isPatient: req.user.role === 'Patient' });
});

// Login for Admin, Doctor, and Patient
router.post("/login", login);

// Get current session data (if logged in)
router.get("/session", session);

module.exports = router;

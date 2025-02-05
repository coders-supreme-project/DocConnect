const express = require("express");
const router = express.Router();
const { register, login, session } = require("../Controller/user.controller");
const { authenticate } = require("../middleware/auth.middelware");
// Register Doctor or Patient
router.post("/register", register);
// const express = require("express");
// const Router = express.Router();
// const { register, login, session } = require("../Controller/user.controller");
// const { authenticate } = require("../middleware/auth.middelware");
// // Register Doctor or Patient
// Router.post("/register", register);

router.get('/check-doctor', authenticate, (req, res) => {
    res.json({ isDoctor: req.user.Role === 'Doctor' });
  });
  router.get('/check-patient', authenticate, (req, res) => {
    res.json({ isPatient: req.user.Role === 'Patient' });
  });   
// Login for Admin, Doctor, and Patient
router.post("/login", login);
router.get("/session", session);
// Router.get('/check-doctor', authenticate, (req, res) => {
//     res.json({ isDoctor: req.user.Role === 'Doctor' });
//   });
//   Router.get('/check-patient', authenticate, (req, res) => {
//     res.json({ isPatient: req.user.Role === 'Patient' });
//   });   
// // Login for Admin, Doctor, and Patient
// Router.post("/login", login);
// Router.get("/session", session);

module.exports = router;

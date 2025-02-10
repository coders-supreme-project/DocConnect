const express = require("express");
const router = express.Router();
const { register, login, session ,getUsers} = require("../controller/user.controller");
const { authenticate } = require("../middleware/auth.middelware");

// Register Doctor or Patient
router.post("/register", register);
// const express = require("express");
// const Router = express.Router();
// const { register, login, session } = require("../Controller/user.controller");
// const { authenticate } = require("../middleware/auth.middelware");
// // Register Doctor or Patient
// Router.post("/register", register);

router.get("/getUsers", getUsers);
// Check if the authenticated user is a Doctor


// Login for Admin, Doctor, and Patient
router.post("/login", login);

// Get current session data (if logged in)
router.get("/session", session);

module.exports = router;

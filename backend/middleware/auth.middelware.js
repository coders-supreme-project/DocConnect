const jwt = require("jsonwebtoken");

// Middleware to verify JWT and role

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token:", token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to allow only Admin
const isAdmin = (req, res, next) => {
  if (req.user.Role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Middleware to allow only Doctors
const isDoctor = (req, res, next) => {
  // console.log(req.user.Role);
  
  if (req.user.Role !== "Doctor") {
    return res.status(403).json({ message: "Access denied. Doctors only." });
  }
  next();
};

// Middleware to allow only Patients
const isPatient = (req, res, next) => {
  if (req.user.Role !== "Patient") {
    return res.status(403).json({ message: "Access denied. Patients only." });
  }
  next();
};

module.exports = {  isAdmin, isDoctor, isPatient ,authenticate}

module.exports = {  isAdmin, isDoctor, isPatient,authenticate };

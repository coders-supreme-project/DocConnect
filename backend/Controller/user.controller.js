const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();

// Register Doctor or Patient

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      specialty,
      experience,
      bio,
      dateOfBirth,
      gender,
      address,
      medicalHistory,
      LocationLatitude,
      LocationLongitude,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !role || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if email already exists
    const existingUser = await db.Doctor.findOne({ where: { email } }) || 
                          await db.Patient.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (role === "Doctor") {
      if (!specialty || !experience) {
        return res.status(400).json({ message: "Specialty and experience are required for doctors" });
      }

      newUser = await db.Doctor.create({
        firstName,
        lastName,
        email,
        Password: hashedPassword, 
        phone,
        specialty,
        experience,
        bio,
        profilePicture: null,
        isVerified: false,
        LocationLatitude,
        LocationLongitude,
      });
    } else if (role === "Patient") {
      if (!dateOfBirth || !gender) {
        return res.status(400).json({ message: "Date of birth and gender are required for patients" });
      }

      newUser = await db.Patient.create({
        firstName,
        lastName,
        email,
        Password: hashedPassword, 
        phone,
        dateOfBirth,
        gender,
        address,
        medicalHistory,
        profilePicture: null,
        LocationLatitude,
        LocationLongitude,
      });
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const token = jwt.sign(
      { id: newUser.id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "User registered successfully", user: newUser, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.login = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Debugging

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    // Find user in either Doctor or Patient table
    let user = await db.Doctor.findOne({ where: { email } }) || 
               await db.Patient.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure password matches
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Create user payload for JWT
    const userPayload = {
      id: user.id,
      role: user.role || (user.specialty ? "Doctor" : "Patient"),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      LocationLatitude: user.LocationLatitude || null,
      LocationLongitude: user.LocationLongitude || null,
    };

    // Generate JWT token
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", user: userPayload, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


  

// Login for Admin, Doctor, and Patient
// exports.login = async (req, res) => {
//   const { Email, Password } = req.body;

//   if (!Email || !Password) {
//     return res.status(400).json({ message: "Email and Password are required" });
//   }

//   try {
//     const user = await db.User.findOne({
//       where: { Email },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(Password, user.Password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     const token = jwt.sign(
//       { UserID: user.UserID, Role: user.Role, LocationLatitude: user.LocationLatitude, LocationLongitude: user.LocationLongitude },
//       process.env.JWT_SECRET,
//       { expiresIn: "10000000h" }
//     );

//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Error logging in", error: error.message });
//   }
// };


exports.session = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    const session = jwt.decode(token, process.env.JWT_SECRET);

    res.status(200).json(session);
  } catch (error) {
    console.log(error);
  }
};

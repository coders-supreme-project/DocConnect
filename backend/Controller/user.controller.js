const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();

// Register Doctor or Patient
exports.register = async (req, res) => {
    const {
      FirstName,
      LastName,
      Username,
      Password,
      Email,
      Role,
      Speciality,
      Bio,
      MeetingPrice,
      Latitude,
      Longitude,
    } = req.body;
  
    if (!Password) {
      return res.status(400).json({ message: "Password is required" });
    }
  
    if (Role !== "Doctor" && Role !== "Patient") {
      return res.status(400).json({ message: "Invalid role. Only Doctor or Patient can register." });
    }
  
    try {
      console.log("Received Password:", Password); // Debugging step
      const hashedPassword = await bcrypt.hash(Password.toString(), 10);
  
      const newUser = await db.User.create({
        FirstName,
        LastName,
        Username,
        Password: hashedPassword,
        Email,
        Role,
        ...(Role === "Doctor" && { Speciality, Bio, MeetingPrice }),
        Speciality: Role === "Doctor" ? Speciality : null,
        Bio: Role === "Doctor" ? Bio : null,
        MeetingPrice: Role === "Doctor" ? MeetingPrice : null,
        LocationLatitude: Latitude,
        LocationLongitude: Longitude,
      });
  
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Error registering user", error: error.message });
    }
  };
  

// Login for Admin, Doctor, and Patient
exports.login = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const user = await db.User.findOne({
      where: { Email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { UserID: user.UserID, Role: user.Role, LocationLatitude: user.LocationLatitude, LocationLongitude: user.LocationLongitude },
      process.env.JWT_SECRET,
      { expiresIn: "10000000h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


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

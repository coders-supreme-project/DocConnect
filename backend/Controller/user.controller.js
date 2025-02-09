const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();

// ✅ Password validation function
const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};

// Register Doctor or Patient
exports.register = async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, role, phone,
            specialty, experience, bio, dateOfBirth, gender,
             medicalHistory, LocationLatitude, LocationLongitude
        } = req.body;

        if (!firstName || !lastName || !email || !password || !role || !phone) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Validate password strength
        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message: "Password must have at least 8 characters, including an uppercase, a lowercase, a number, and a special character."
            });
        }

        // ✅ Check if email already exists
        const existingUser = await db.Doctor.findOne({ where: { email } }) || 
                              await db.Patient.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // ✅ Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;

        if (role === "Doctor") {
            if (!specialty || !experience) {
                return res.status(400).json({ message: "Specialty and experience are required for doctors." });
            }

            newUser = await db.Doctor.create({
                firstName, lastName, email, Password: hashedPassword, 
                phone, specialty, experience, bio,
                profilePicture: null, isVerified: false,
                LocationLatitude, LocationLongitude
            });
        } else if (role === "Patient") {
            if (!dateOfBirth || !gender) {
                return res.status(400).json({ message: "Date of birth and gender are required for patients." });
            }

            newUser = await db.Patient.create({
                firstName, lastName, email, Password: hashedPassword, 
                phone, dateOfBirth, gender, medicalHistory,
                profilePicture: null, LocationLatitude, LocationLongitude
            });
        } else {
            return res.status(400).json({ message: "Invalid role specified." });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ message: "User registered successfully!", user: newUser, token });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await db.Doctor.findOne({ where: { email } }) || 
                   await db.Patient.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const role = user.specialty ? "Doctor" : "Patient";
        const userPayload = {
            id: user.id, role, firstName: user.firstName, lastName: user.lastName, email: user.email
        };

        console.log("✅ User logged in:", userPayload); // Debugging

        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful.", user: userPayload, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in.", error: error.message });
    }
};

// ✅ Session Validation
exports.session = async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }

        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Token required." });
        }

        const session = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json(session);
    } catch (error) {
        console.error("Session error:", error);
        res.status(500).json({ message: "Invalid token or server error." });
    }
};

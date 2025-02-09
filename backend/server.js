const express = require("express");

const cors = require("cors");
const db=require("../backend/models/index")

// Import routes
const authRoutes = require("./Routes/user.routes");
const doctorRoutes = require("./Routes/doctor.routes");
const appointmentRoutes = require("./Routes/appointment.routes");
const availabilityRoutes = require("./Routes/availibility.routes");
const chatRoutes = require("./Routes/chatRoom.routes");
const chatMessageRoutes = require("./Routes/chatroomMessage.routes");
const specialityRoutes=require("./Routes/speciality.routes")

// Initialize Express App
const App = express();

const vedio=require("./Routes/vedio.routes")

const axios = require('axios');
const nodemailer = require('nodemailer');
// const appointment=require("./Routes")

const port = process.env.PORT || 5000;

// Middleware
App.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

// Routes
App.use("/api/users", authRoutes);
App.use("/api/doctor", doctorRoutes);
App.use("/api/appointment", appointmentRoutes);
App.use("/api/availability", availabilityRoutes);
App.use("/api/chats", chatRoutes);
App.use("/api/messages", chatMessageRoutes);
App.use("/api/speciality",specialityRoutes)

App.use('/api/vedio', vedio);

// App.use("/", );
// App.use("/", );
// App.use("/", );
// App.use("/" )
// Create HTTP server
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(App);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Replace with your frontend URL
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a chatroom
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    // Send a message to a chatroom
    socket.on("send_message", (data) => {
        socket.to(`chatroom-${data.ChatroomID}`).emit("receive_message", data);
        console.log("Message sent:", data);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
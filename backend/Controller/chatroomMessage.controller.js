const db = require("../models");

// Send a message in a chatroom
exports.createMessage = async (req, res) => {
    try {

        console.log("📥 Received request body:", req.body); // ✅ Add this to debug
        const { chatroomId, messageText, PatientID, DoctorID } = req.body;

        if (!chatroomId || !messageText || (!PatientID && !DoctorID)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let senderName = "Unknown"; // Default name

        // Get sender name based on role
        if (PatientID) {
            const patient = await db.Patient.findByPk(PatientID);
            if (patient) senderName = `${patient.firstName} ${patient.lastName}`;
        } else if (DoctorID) {
            const doctor = await db.Doctor.findByPk(DoctorID);
            if (doctor) senderName = `${doctor.firstName} ${doctor.lastName}`;
        }

        // Create the message
        const newMessage = await db.ChatroomMessage.create({
            ChatroomID: chatroomId,
            MessageText: messageText,
            SentAt: new Date(),
            PatientID,
            DoctorID,
            SenderName: senderName, // Store sender name
        });

        res.status(201).json({ message: newMessage });
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all messages in a chatroom
exports.getMessages = async (req, res) => {
    try {
        const { chatroomId } = req.params;

        const messages = await db.ChatroomMessage.findAll({
            where: { ChatroomID: chatroomId },
            include: [
                { model: db.Doctor, as: "Doctor", attributes: ["firstName", "lastName"] },
                { model: db.Patient, as: "Patient", attributes: ["firstName", "lastName"] }
            ],
            order: [["SentAt", "ASC"]],
        });

        // Format messages for frontend
        const formattedMessages = messages.map((message) => {
            const senderName = message.Doctor
                ? `${message.Doctor.firstName} ${message.Doctor.lastName}`
                : message.Patient
                ? `${message.Patient.firstName} ${message.Patient.lastName}`
                : "Unknown User";
        
            return {
                ...message.toJSON(),
                SenderName: senderName,
                SenderRole: message.Doctor ? "Doctor" : "Patient",
                SentAt: message.SentAt ? new Date(message.SentAt).toISOString() : null,
            };
        });

        res.status(200).json({ messages: formattedMessages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Find the message
        const message = await db.ChatroomMessage.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Delete the message
        await message.destroy();
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
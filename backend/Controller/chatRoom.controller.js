const db = require("../models");
const ChatRoom = db.Chatrooms

// Create a new chatroom
exports.createChatroom = async (req, res) => {
  try {
      const { PatientID, DoctorID } = req.body;

      if (!PatientID || !DoctorID) {
          return res.status(400).json({ message: "PatientID and DoctorID are required" });
      }

      // ✅ Check if a chatroom already exists
      let chatroom = await db.Chatrooms.findOne({
          where: { PatientID, DoctorID }
      });

      if (!chatroom) {
          // ✅ If no chatroom exists, create a new one
          chatroom = await db.Chatrooms.create({ PatientID, DoctorID, StartTime: new Date() });
      }

      res.status(201).json({ message: "Chatroom found or created successfully", chatroom });
  } catch (error) {
      console.error("Error creating chatroom:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};
       

// Get all chatrooms for a user (patient or doctor)

exports.getChatrooms = async (req, res) => {
    try {
        const { userId, role } = req.query;

        console.log("Fetching chatrooms for userId:", userId, "Role:", role);

        if (!userId || !role) {
            return res.status(400).json({ message: "Missing userId or role" });
        }

        let chatrooms;
        if (role === "Patient") {
            chatrooms = await ChatRoom.findAll({
                where: { PatientID: userId },
                include: [{ model: db.Doctor, as: "ChatroomDoctor", attributes: ["firstName", "lastName"] }],
            });
        } else if (role === "Doctor") {
            chatrooms = await ChatRoom.findAll({
                where: { DoctorID: userId },
                include: [{ model: db.Patient, as: "Patient", attributes: ["firstName", "lastName"] }],
            });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        console.log("Chatrooms retrieved:", chatrooms); // ✅ Debugging

        if (!chatrooms || chatrooms.length === 0) {
            return res.status(404).json({ message: "No chatrooms found" });
        }

        res.status(200).json({ message: "Chatrooms retrieved successfully", chatrooms });
    } catch (error) {
        console.error("Error fetching chatrooms:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get a single chatroom by ID
exports.getChatroomById = async (req, res) => {
    try {
        const { chatroomId } = req.params;

        const chatroom = await db.Chatrooms.findByPk(chatroomId, {
            include: [
                { model: db.Patient, as: "Patient" },
                { model: db.Doctor, as: "ChatroomDoctor" },
            ],
        });

        if (!chatroom) {
            return res.status(404).json({ message: "Chatroom not found" });
        }

        res.status(200).json({ message: "Chatroom retrieved successfully", chatroom });
    } catch (error) {
        console.error("Error fetching chatroom:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a chatroom by ID
exports.deleteChatroom = async (req, res) => {
    try {
        const { chatroomId } = req.params;

        const chatroom = await db.Chatrooms.findByPk(chatroomId);

        if (!chatroom) {
            return res.status(404).json({ message: "Chatroom not found" });
        }

        await chatroom.destroy();
        res.status(200).json({ message: "Chatroom deleted successfully" });
    } catch (error) {
        console.error("Error deleting chatroom:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
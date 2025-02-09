const express = require("express");
const router = express.Router();
const chatroomController = require("../Controller/chatRoom.controller");

// Create a new chatroom
router.post("/create", chatroomController.createChatroom);

// Get all chatrooms for a user (patient or doctor)
router.get("/", chatroomController.getChatrooms);

// Get a single chatroom by ID
router.get("/:chatroomId", chatroomController.getChatroomById);

// Delete a chatroom by ID
router.delete("/:chatroomId", chatroomController.deleteChatroom);

module.exports = router;
const express = require("express");
const router = express.Router();
const chatroomMessageController = require("../Controller/chatroomMessage.controller");

// Send a message in a chatroom
router.post("/", chatroomMessageController.createMessage);

// Get all messages in a chatroom
router.get("/:chatroomId", chatroomMessageController.getMessages);

// Delete a message by ID
router.delete("/:messageId", chatroomMessageController.deleteMessage);

module.exports = router;
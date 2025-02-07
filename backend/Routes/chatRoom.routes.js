const express = require('express');
const router = express.Router();
const chatRoomController = require('../Controller/chatRoom.controller.js');
const { authenticate } = require('../middleware/auth.middelware.js'); // Assuming you have an auth middleware

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new chat room
// Updated to take `participantId` from the request body to handle both doctor and patient correctly
router.post('/create', chatRoomController.createChatRoom);

// Get all chat rooms for the authenticated user
router.get('/', chatRoomController.getAllChatRooms);

// Get a specific chat room by ID
router.get('/:id', chatRoomController.getChatRoomById);

// Send a message in a chat room
router.post('/message', chatRoomController.sendMessage);

// Get messages for a specific chat room
router.get('/:chatroomId/messages', chatRoomController.getChatRoomMessages);

module.exports = router;

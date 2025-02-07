const { Doctor, Patient, Chatrooms, ChatroomMessage } = require('../models/index');
const { Op } = require('sequelize');

exports.createChatRoom = async (req, res) => {
  try {
    const { userId } = req.user;
    const { participantId } = req.body; // Assume the ID of the participant is passed

    let DoctorID, PatientID;

    const userIsDoctor = await Doctor.findOne({ where: { userId } });
    const userIsPatient = await Patient.findOne({ where: { userId } });

    // Identify the roles based on the current user and participant
    if (userIsDoctor) {
      DoctorID = userIsDoctor.id;
      PatientID = participantId; // Participant must be a patient in this case
    } else if (userIsPatient) {
      DoctorID = participantId; // Participant must be a doctor in this case
      PatientID = userIsPatient.id;
    } else {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    // Check if the chatroom already exists
    const existingChatRoom = await Chatrooms.findOne({
      where: {
        [Op.and]: [
          { DoctorID },
          { PatientID }
        ]
      }
    });

    if (existingChatRoom) {
      return res.status(409).json({
        message: 'Chat room already exists',
        chatRoom: existingChatRoom,
      });
    }

    const newChatRoom = await Chatrooms.create({
      DoctorID,
      PatientID,
    });

    res.status(201).json({
      message: 'Chat room created successfully',
      chatRoom: newChatRoom,
    });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getAllChatRooms = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userIsDoctor = await Doctor.findOne({ where: { userId } });
    const userIsPatient = await Patient.findOne({ where: { userId } });

    let chatRooms;

    if (userIsDoctor) {
      chatRooms = await Chatrooms.findAll({
        where: { DoctorID: userIsDoctor.id },
        include: [
          { model: Patient, as: 'Patient', attributes: ['id', 'firstName', 'lastName', 'email'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else if (userIsPatient) {
      chatRooms = await Chatrooms.findAll({
        where: { PatientID: userIsPatient.id },
        include: [
          { model: Doctor, as: 'Doctor', attributes: ['id', 'firstName', 'lastName', 'email'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      return res.status(403).json({ message: 'Invalid user role' });
    }

    res.status(200).json(chatRooms);
  } catch (error) {
    console.error('Error fetching user chat rooms:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
exports.getChatRoomById = async (req, res) => {
    try {
      const chatRoom = await Chatrooms.findOne({
        where: { id: req.params.id },
        include: [
          { model: Doctor, as: 'Doctor', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Patient, as: 'Patient', attributes: ['id', 'firstName', 'lastName', 'email'] }
        ]
      });
  
      if (!chatRoom) {
        return res.status(404).json({ message: 'Chat room not found' });
      }
  
      res.status(200).json(chatRoom);
    } catch (error) {
      console.error('Error fetching chat room by ID:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  exports.sendMessage = async (req, res) => {
    try {
      const { chatroomId, messageText } = req.body;
      const { userId } = req.user;
  
      // Check if the chat room exists
      const chatRoom = await Chatrooms.findOne({ where: { id: chatroomId } });
      if (!chatRoom) {
        return res.status(404).json({ message: 'Chat room not found' });
      }
  
      // Determine if the sender is a Doctor or Patient
      const userIsDoctor = await Doctor.findOne({ where: { userId } });
      const userIsPatient = await Patient.findOne({ where: { userId } });
  
      let SenderID;
      if (userIsDoctor) {
        SenderID = userIsDoctor.id;
      } else if (userIsPatient) {
        SenderID = userIsPatient.id;
      } else {
        return res.status(400).json({ message: 'Invalid user role' });
      }
  
      // Create and store the message
      const newMessage = await ChatroomMessage.create({
        ChatroomID: chatroomId,
        SenderID,
        MessageText: messageText
      });
  
      res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  exports.getChatRoomMessages = async (req, res) => {
    try {
      const { chatroomId } = req.params;
  
      const chatRoom = await Chatrooms.findOne({ where: { id: chatroomId } });
      if (!chatRoom) {
        return res.status(404).json({ message: 'Chat room not found' });
      }
  
      // Fetch messages for the specific chat room
      const messages = await ChatroomMessage.findAll({
        where: { ChatroomID: chatroomId },
        order: [['createdAt', 'ASC']]
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching chat room messages:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

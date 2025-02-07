import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Box, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import ChatMessages from './ChatMessages';
import CloseIcon from '@mui/icons-material/Close';
import io from 'socket.io-client';

interface ChatRoom {
  ChatroomID: number;
  Patient?: {
    FirstName: string;
    LastName: string;
    UserID?: number;
  };
  Doctor?: {
    FirstName: string;
    LastName: string;
    UserID?: number;
  };
  PatientID?: number;
  DoctorID?: number;
}

interface ChatRoomsProps {
  onClose?: () => void;
}

const socket = io('http://localhost:4000');

const ChatRooms: React.FC<ChatRoomsProps> = ({ onClose }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  const getRoomAndJoin = (chatRoom: ChatRoom) => {
    setSelectedRoom(chatRoom.ChatroomID);
    socket.emit('join', chatRoom.ChatroomID);
    console.log(`Joining room ${chatRoom.ChatroomID}`);
  };

  const checkUserRole = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }
  
    try {
      const doctorResponse = await axios.get('http://localhost:5000/api/users/check-doctor', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Doctor check response:', doctorResponse.data); // Add logging
      if (doctorResponse.data.isDoctor) {
        setIsDoctor(true);
        return;
      }
  
      const patientResponse = await axios.get('http://localhost:5000/api/users/check-patient', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Patient check response:', patientResponse.data); // Add logging
      if (patientResponse.data.isPatient) {
        setIsDoctor(false);
        return;
      }
  
      setError('User role could not be determined.');
    } catch (error) {
      console.error('Error checking user role:', error);
      setError('Error checking user role. Please try again.');
    }
  };
  

  const getDisplayName = (room: ChatRoom) => {
    if (isDoctor) {
      if (room.Patient) {
        return `${room.Patient.FirstName} ${room.Patient.LastName}`;
      } else {
        console.error('Missing patient data for room:', room.ChatroomID);
        return 'Unknown Patient';
      }
    } else {
      if (room.Doctor) {
        return `Dr. ${room.Doctor.FirstName} ${room.Doctor.LastName}`;
      } else {
        console.error('Missing doctor data for room:', room.ChatroomID);
        return 'Unknown Doctor';
      }
    }
  };

  useEffect(() => {
    console.log('Chat Rooms:', chatRooms); // Debugging: Log the rooms to ensure they have the expected data
  }, [chatRooms]);

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ width: 250, borderRight: '1px solid #ccc' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6">Chat Rooms</Typography>
          {onClose && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {error ? (
          <Typography sx={{ p: 2, color: 'red' }}>{error}</Typography>
        ) : (
          <List>
            {chatRooms.map((room) => (
              <ListItem disablePadding key={room.ChatroomID}>
                <ListItemButton onClick={() => getRoomAndJoin(room)} selected={selectedRoom === room.ChatroomID}>
                  <ListItemText primary={getDisplayName(room)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {selectedRoom ? (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <ChatMessages socket={socket} roomId={selectedRoom} meetLink={meetLink} />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">Select a chat room to view messages</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatRooms;

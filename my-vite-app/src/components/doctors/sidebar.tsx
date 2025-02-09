import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [showChatRooms, setShowChatRooms] = useState(false);

  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`); // Debugging navigation
    navigate(path);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, onClick: () => handleNavigation('/') },
    { text: 'Overview', icon: <DashboardIcon />, onClick: () => handleNavigation('/profile') },
    { text: 'Appointment', icon: <EventIcon />, onClick: () => handleNavigation('/appointments') },
    { text: 'My Patients', icon: <PersonIcon />, onClick: () => handleNavigation('/patients') },
    { text: 'Schedule Timings', icon: <EventIcon />, onClick: () => handleNavigation('/doctor/availability') },
    { text: 'Payments', icon: <PaymentIcon />, onClick: () => handleNavigation('/payments') },
    { text: 'Messages', icon: <MessageIcon />, onClick: () => handleNavigation('/chat') },
    { text: 'Blog', icon: <ArticleIcon />, onClick: () => handleNavigation('/blog') },
    { text: 'Settings', icon: <SettingsIcon />, onClick: () => handleNavigation('/settings') },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f8f8',
          padding: '16px',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', paddingBottom: '20px' }}>
        <img
          src="https://www.clipartmax.com/png/small/54-545682_doctor-logo-doctor-logo-png.png"
          alt="Doct Logo"
          style={{ width: '30px', marginRight: '10px' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Doct.
        </Typography>
      </Box>

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            sx={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: '#000', // Black background on hover
                color: '#fff', // White text on hover
              },
              '&.Mui-selected': {
                backgroundColor: '#000', // Black background for selected item
                color: '#fff', // White text for selected item
              },
            }}
            onClick={item.onClick}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

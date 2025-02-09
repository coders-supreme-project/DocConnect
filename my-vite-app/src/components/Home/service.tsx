import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import ServiceCard from './servicecard';

const ServicesWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 30%, #2196f3 90%)', // Gradient background
  backgroundImage: `url('https://www.symphonyrisk.com/wp-content/uploads/medical-21.jpg')`, // Subtle pattern overlay
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  padding: theme.spacing(10, 0),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for contrast
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '300px',
    height: '300px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    top: '-50px',
    left: '-50px',
    zIndex: 2,
  },
  '& > *': {
    position: 'relative',
    zIndex: 3,
  },
  '&::before, &::after': {
    animation: 'moveShapes 8s infinite alternate ease-in-out',
  },
  '@keyframes moveShapes': {
    '0%': { transform: 'translateY(0px)' },
    '100%': { transform: 'translateY(30px)' },
  },
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  textAlign: 'center',
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ffffff, #bbdefb)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
}));

const AllServices: React.FC = () => {
  const services = [
    { 
      id: '1', 
      title: 'General Checkup', 
      description: 'A General Checkup is a routine medical examination designed to assess overall health, detect potential issues early, and promote preventive care. It includes medical history review, physical exams, and lab tests.', 
      imageUrl: 'https://d.newsweek.com/en/full/1570341/fe-tophospitals-01.jpg' 
    },
    { 
      id: '2', 
      title: 'Specialist Consultation', 
      description: 'A Specialist Consultation provides expert evaluation and treatment for specific health concerns, ensuring patients receive focused medical care tailored to their needs.', 
      imageUrl: 'https://media.istockphoto.com/id/1404179486/photo/anesthetist-working-in-operating-theatre-wearing-protecive-gear-checking-monitors-while.jpg?s=612x612&w=0&k=20&c=gecZ0b-nDIuMOvRIt8Qyam-eSx6RBdUzn5yDh0nNEvM=' 
    },
    { 
      id: '3', 
      title: 'Lab Tests', 
      description: 'Lab Tests analyze blood, urine, and other body fluids to detect diseases, assess organ function, and monitor health conditions, aiding in early diagnosis and treatment.', 
      imageUrl: 'https://alamhospital.in/wp-content/uploads/2022/01/Prevea-Internal-Medicine-Focused-on-Wellness.jpg' 
    },
    { 
      id: '4', 
      title: 'Vaccinations', 
      description: 'Vaccinations protect against infectious diseases by boosting immunity, reducing the risk of severe illnesses such as measles, flu, and hepatitis.', 
      imageUrl: 'https://media.istockphoto.com/id/1437830105/photo/cropped-shot-of-a-female-nurse-hold-her-senior-patients-hand-giving-support-doctor-helping.jpg?s=612x612&w=0&k=20&c=oKR-00at4oXr4tY5IxzqsswaLaaPsPRkdw2MJbYHWgA=' 
    },
  ];

  return (
    <ServicesWrapper>
      <Container maxWidth="lg">
        <TitleWrapper>
          <GradientTitle variant="h2">
            Our Services
          </GradientTitle>
        </TitleWrapper>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <ServiceCard 
                id={service.id} 
                title={service.title} 
                description={service.description} 
                imageUrl={service.imageUrl} 
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ServicesWrapper>
  );
};

export default AllServices;

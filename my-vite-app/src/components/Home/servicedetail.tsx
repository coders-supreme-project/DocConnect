import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Service } from '../../features/selctedserviceslice';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const HeroWrapper = styled(Box)(({ theme }) => ({
 backgroundImage: 'url(https://www.symphonyrisk.com/wp-content/uploads/medical-21.jpg)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    top: '-100px',
    left: '-100px',
    filter: 'blur(100px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '500px',
    height: '500px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    bottom: '-150px',
    right: '-150px',
    filter: 'blur(100px)',
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(5),
  textAlign: 'center',
  maxWidth: '700px',
  color: '#fff',
  boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
  zIndex: 2,
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ffffff, #bbdefb)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
}));

const ServiceImage = styled('img')({
  width: '100%',
  maxHeight: '350px',
  borderRadius: '15px',
  objectFit: 'cover',
  boxShadow: '0px 8px 20px rgba(0,0,0,0.3)',
  animation: 'fadeIn 1.2s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
});

const CustomButton = styled(Button)({
  marginTop: '20px',
  background: 'rgba(255, 255, 255, 0.3)',
  color: '#fff',
  borderRadius: '30px',
  padding: '10px 20px',
  fontSize: '1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.5)',
  },
});

const ServiceDetails: React.FC = () => {
  const selectedService = useSelector<RootState, Service | null>(
    (state) => state.selectedService
  );

  if (!selectedService) {
    return (
      <HeroWrapper>
        <Typography variant="h4" color="white">No service selected</Typography>
      </HeroWrapper>
    );
  }

  return (
    <HeroWrapper>
      <Container maxWidth="md">
        <ContentWrapper>
          <GradientTitle variant="h2">{selectedService.title}</GradientTitle>
          <ServiceImage src={selectedService.imageUrl} alt={selectedService.title} />
          <Typography variant="body1" paragraph sx={{ marginTop: 2 }}>
            {selectedService.description}
          </Typography>
          <CustomButton>Learn More</CustomButton>
        </ContentWrapper>
      </Container>
    </HeroWrapper>
  );
};

export default ServiceDetails;

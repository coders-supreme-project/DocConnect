import React, { useEffect, useCallback, useState } from 'react';
import { Grid, Typography, Paper, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { login, LoginPayload } from '../../store/authSlice';
import { fetchAppointmentsByUserId, clearAppointmentsState } from '../../features/appointmentslice';
import StatCard from './StatCard';
import AppointmentList from './appointmentlist';
import PatientChart from './patientchart';
import RecentPatients from './RecentPatients';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';

interface User {
  LastName?: string;
}

interface Review {
  Rating: number;
  ReviewText: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { appointments, loadingApp, errorApp, notFound } = useSelector((state: RootState) => ({
    appointments: state.appointment.appointments,
    loadingApp: state.appointment.loadingApp,
    errorApp: state.appointment.errorApp,
    notFound: state.appointment.notFound
  }));

  const [reviews, setReviews] = useState<Review[]>([]);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      if (!isAuthenticated && !loading) {
        const userPayload = await dispatch(login({ token } as LoginPayload)).unwrap();
        localStorage.setItem('userId', userPayload.id.toString());
      }
      
      await dispatch(fetchAppointmentsByUserId()).unwrap();
    } catch (error) {
      // Error is now handled in the slice
      console.error('Failed to fetch data:', error);
    }
  }, [dispatch, isAuthenticated, loading]);

  const fetchReviews = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in local storage');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/review/${userId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  }, []);

  useEffect(() => {
    dispatch(clearAppointmentsState());
    
    if (!isAuthenticated || appointments.length === 0) {
      fetchData();
    }

    fetchReviews();
  }, [fetchData, fetchReviews, isAuthenticated, appointments.length, dispatch]);

  const handleRetry = () => {
    dispatch(clearAppointmentsState());
    fetchData();
  };

  const getWelcomeMessage = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'Welcome, Doctor';
    
    const doctorName = (user as User).LastName || 'Doctor';
    return `Welcome, Dr. ${doctorName}`;
  };

  const renderAppointmentsContent = () => {
    if (loadingApp) {
      return <Typography>Loading appointments...</Typography>;
    }

    if (notFound) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h6" gutterBottom>
            No appointments found
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            You currently don't have any appointments scheduled.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRetry}
            sx={{ mt: 2 }}
          >
            Refresh Appointments
          </Button>
        </Box>
      );
    }

    if (errorApp && !notFound) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="error" gutterBottom>
            {errorApp}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRetry}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      );
    }

    if (appointments.length === 0) {
      return <Typography>No appointments available</Typography>;
    }

    return <AppointmentList appointments={appointments} />;
  };

  const renderReviewsContent = () => {
    if (reviews.length === 0) {
      return <Typography>No reviews available</Typography>;
    }

    return (
      <Box>
        {reviews.map((review, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Rating:</Typography>
            <ReactStars
              count={5}
              value={review.Rating}
              size={24}
              edit={false}
              activeColor="#ffd700"
            />
            <Typography variant="body1">{review.ReviewText}</Typography>
          </Paper>
        ))}
      </Box>
    );
  };

  const statsData = [
    { title: "Appointments", value: appointments.length.toString(), color: "#8e44ad" },
    { title: "Total Patients", value: "N/A", color: "#e74c3c" },
    { title: "Clinic Consulting", value: "N/A", color: "#f39c12" },
    { title: "Video Consulting", value: "N/A", color: "#3498db" }
  ];

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {getWelcomeMessage()}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Have a nice day at great work!
        </Typography>

        <Grid container spacing={3}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard
                title={stat.title}
                value={stat.value}
                color={stat.color}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              {renderAppointmentsContent()}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <PatientChart />
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <RecentPatients />
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              {renderReviewsContent()}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
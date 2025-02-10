import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { AppDispatch, RootState } from "../../store/store";
import { login, LoginPayload } from '../../store/authSlice';
import { clearAppointmentsState } from '../../features/appointmentslice';
import Sidebar from '../../../src/components/doctors/sidebar';
import StatCard from '../doctors/StatCard';
import AppointmentList from '../doctors/appointmentlist';
import PatientChart from '../doctors/patientchart';
import RecentPatients from '../doctors/RecentPatients';
import ReactStars from 'react-rating-stars-component';

interface Appointment {
  AppointmentID: number;
  AppointmentDate: string;
  Status: string;
  Patient: {
    FirstName: string;
    LastName: string;
  };
}

interface Review {
  Rating: number;
  ReviewText: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Local state for appointments & reviews
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const doctorId = localStorage.getItem('userId');

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      const response = await axios.get(`http://localhost:5000/api/appointment/${doctorId}`);
      if (response.data.length === 0) {
        setNotFound(true);
      } else {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setError('Failed to fetch appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  const fetchReviews = useCallback(async () => {
    try {
      if (!doctorId) {
        console.error('User ID not found in local storage');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/review/${doctorId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  }, [doctorId]);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!isAuthenticated && !authLoading) {
        const userPayload = await dispatch(login({ token } as LoginPayload)).unwrap();
        localStorage.setItem('userId', userPayload.id.toString());
      }
    } catch (error) {
      console.error('Failed to authenticate:', error);
    }
  }, [dispatch, isAuthenticated, authLoading]);

  useEffect(() => {
    dispatch(clearAppointmentsState());
    fetchData();
    fetchAppointments();
    fetchReviews();
  }, [fetchData, fetchAppointments, fetchReviews, dispatch]);

  const handleRetry = () => {
    fetchAppointments();
  };

  const getWelcomeMessage = () => {
    const doctorName = localStorage.getItem('userName') || 'Doctor';
    return `Welcome, Dr. ${doctorName}`;
  };

  const renderAppointmentsContent = () => {
    if (loading) return <Typography>Loading appointments...</Typography>;

    if (notFound) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h6" gutterBottom>No appointments found</Typography>
          <Typography color="textSecondary">You currently don't have any appointments scheduled.</Typography>
          <Button variant="contained" color="primary" onClick={handleRetry} sx={{ mt: 2 }}>Refresh Appointments</Button>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" color="primary" onClick={handleRetry} sx={{ mt: 2 }}>Retry</Button>
        </Box>
      );
    }

    if (appointments.length === 0) return <Typography>No appointments available</Typography>;

    return <AppointmentList appointments={appointments} />;
  };

  const renderReviewsContent = () => {
    if (reviews.length === 0) return <Typography>No reviews available</Typography>;

    return (
      <Box>
        {reviews.map((review, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Rating:</Typography>
            <ReactStars count={5} value={review.Rating} size={24} edit={false} activeColor="#ffd700" />
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
        <Typography variant="h4" gutterBottom>{getWelcomeMessage()}</Typography>
        <Typography variant="subtitle1">Have a nice day at great work!</Typography>

        <Grid container spacing={3}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard title={stat.title} value={stat.value} color={stat.color} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>{renderAppointmentsContent()}</Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}><PatientChart /></Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}><Paper sx={{ p: 2 }}><RecentPatients /></Paper></Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}><Paper sx={{ p: 2 }}>{renderReviewsContent()}</Paper></Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;

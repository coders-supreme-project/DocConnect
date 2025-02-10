import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Box, Button } from '@mui/material';
import axios from 'axios';
import StatCard from './StatCard';
import AppointmentList from './appointmentlist';
import PatientChart from './patientchart';
import RecentPatients from './RecentPatients';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';

interface User {
  LastName?: string;
}

interface Appointment {
  AppointmentID: number;
  AppointmentDate: string;
  Status: string;
  Patient: {
    FirstName: string;
    LastName: string;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const doctorId = localStorage.getItem('userId'); 
  console.log(doctorId,'doctor iid')
  const fetchAppointments = async () => {
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
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const handleRetry = () => {
    fetchAppointments();
  };

  const getWelcomeMessage = () => {
    const doctorName = localStorage.getItem('userName') || 'Doctor';
    return `Welcome, Dr. ${doctorName}`;
  };

  const renderAppointmentsContent = () => {
    if (loading) {
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

    if (error) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="error" gutterBottom>
            {error}
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
      </Box>
    </Box>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById, updateDoctorProfile } from '../../features/doctorslice';
import { RootState, AppDispatch } from '../../store/store';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';

// Types
interface DoctorProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  bio: string;
  profilePicture?: string;
  LocationLatitude?: number;
  LocationLongitude?: number;
}

const SPECIALTIES = [
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Orthopedist',
] as const;

// Styled Components
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  margin: 'auto',
  border: `4px solid ${theme.palette.primary.main}`,
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  boxShadow: (theme.shadows as string[])[4],}));

const TabSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const DoctorProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { doctor, loading, error } = useSelector((state: RootState) => state.doctor);

  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState<DoctorProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    experience: 0,
    bio: '',
    LocationLatitude: undefined,
    LocationLongitude: undefined,
  });

  useEffect(() => {
    if (doctor) {
      setProfileData({
                firstName: doctor.FirstName || '',
                lastName: doctor.LastName || '',
                email: doctor.email || '',
                phone: doctor.phone || '',
                specialty: doctor.Speciality || '',
                experience: doctor.experience || 0,
                bio: doctor.Bio || '',
                profilePicture: doctor.avatarUrl,
                LocationLatitude: doctor.LocationLatitude,
                LocationLongitude: doctor.LocationLongitude,
              });
    }
  }, [doctor]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = e.target.type === 'number' ? parseInt(value) : value;
    setProfileData(prev => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async () => {
    if (doctor?.id) {
      try {
        await dispatch(updateDoctorProfile({
          id: doctor.id,
          FirstName: profileData.firstName,
          LastName: profileData.lastName,
          Speciality: profileData.specialty,
          MeetingPrice: doctor.MeetingPrice,
          Bio: profileData.bio,
        })).unwrap();
        setEditMode(false);
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );

  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (!doctor) return <Alert severity="warning">No doctor data found.</Alert>;

  const ProfileForm = () => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Specialty"
            name="specialty"
            value={profileData.specialty}
            onChange={handleInputChange}
            fullWidth
            required
          >
            {SPECIALTIES.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Years of Experience"
            name="experience"
            type="number"
            value={profileData.experience}
            onChange={handleInputChange}
            fullWidth
            required
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Bio"
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Latitude"
            name="LocationLatitude"
            type="number"
            value={profileData.LocationLatitude || ''}
            onChange={handleInputChange}
            fullWidth
            InputProps={{ inputProps: { step: "0.000001" } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Longitude"
            name="LocationLongitude"
            type="number"
            value={profileData.LocationLongitude || ''}
            onChange={handleInputChange}
            fullWidth
            InputProps={{ inputProps: { step: "0.000001" } }}
          />
        </Grid>
      </Grid>
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
          Cancel
        </Button>
      </Box>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <ProfileCard>
            <CardContent>
              <ProfileAvatar
                src={doctor.avatarUrl || '/default-avatar.jpg'}
                alt={`Dr. ${doctor.FirstName} ${doctor.LastName}`}
              />
              {!editMode ? (
                <>
                  <Typography variant="h5" gutterBottom mt={2}>
                    Dr. {doctor.FirstName} {doctor.LastName}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {doctor.Speciality}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {doctor.experience} years of experience
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="subtitle1">Contact</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {doctor.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {doctor.phone}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="subtitle1">Bio</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {doctor.Bio}
                    </Typography>
                  </Box>
                  <Box mt={3}>
                    <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                  </Box>
                </>
              ) : (
                <ProfileForm />
              )}
            </CardContent>
          </ProfileCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box mb={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Profile" />
              <Tab label="Schedule" />
              <Tab label="Reviews" />
              <Tab label="Settings" />
            </Tabs>
          </Box>
          <TabSection>
            {/* Tab content will be implemented based on requirements */}
            <Box>
              <Typography variant="h6" gutterBottom>
                {['Profile', 'Schedule', 'Reviews', 'Settings'][tabValue]}
              </Typography>
            </Box>
          </TabSection>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorProfile;
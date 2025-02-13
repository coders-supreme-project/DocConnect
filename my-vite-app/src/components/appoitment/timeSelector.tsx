import * as React from "react";
const { useState } = React;
import { useDispatch } from 'react-redux';
import { bookAppointment } from '../actions/actions';
import axios from 'axios';
import { Button, Typography, Grid, Snackbar, Box } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ConfirmationModal from './confirmationModal';
import { TimeSlotSelectorProps } from '../types/types';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ doctorID, patientID, selectedDate, appointmentType }) => {
    const dispatch = useDispatch();
    const availableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00']; 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState('');

    const handleSlotSelection = (slot: string) => {
        setSelectedSlot(slot);
        setOpenConfirmationModal(true);
    };

    const handleConfirmAppointment = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/appointment/create', {
                doctorId: doctorID, // Use the doctorID prop
                patientId: patientID, // Use the patientID prop
                appointmentDate: selectedDate, // Use the selectedDate prop
                DurationMinutes: 30,
                type: appointmentType // Ensure this is passed correctly
            });
            if (response.status === 201) {
                dispatch(bookAppointment({ doctorId: doctorID, patientId: patientID, slot: selectedSlot }));
                setSnackbarMessage('Appointment booked successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            setSnackbarMessage('Error booking appointment. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
        setOpenConfirmationModal(false);
    };

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
                Available Time Slots
            </Typography>
            <Grid container spacing={2}>
                {availableSlots.map((slot, index) => (
                    <Grid item key={index}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleSlotSelection(slot)}
                        >
                            {slot}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <ConfirmationModal
                open={openConfirmationModal}
                onClose={() => setOpenConfirmationModal(false)}
                onConfirm={handleConfirmAppointment}
                appointmentDetails={{
                    doctorId: doctorID, // Use the doctorID prop
                    patientId: patientID, // Use the patientID prop
                    slot: selectedSlot,
                    date: selectedDate.toLocaleDateString()
                }}
            />
        </Box>
    );
};

export default TimeSlotSelector;
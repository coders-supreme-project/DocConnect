import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { ConfirmationModalProps } from '../types/types';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    appointmentDetails
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                Confirm Your Appointment
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Appointment Details
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                            Date: {appointmentDetails.date}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                            Time: {appointmentDetails.slot}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    By confirming, you agree to our appointment scheduling terms.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button 
                    onClick={onClose} 
                    color="inherit"
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color="primary" 
                    variant="contained"
                    sx={{ ml: 2 }}
                >
                    Confirm Appointment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;



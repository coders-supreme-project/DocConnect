import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch } from 'react-redux';
import { setSelectedDate, setAvailableSlots } from '../actions/actions';
import axios from 'axios';
import { Card, Box, Typography, Grid, Divider } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import './appointmentCalemder.css';

interface AppointmentCalendarProps {
    DoctorID: number;
}

interface Appointment {
    title: string;
    time: string;
    description: string;
}

const AppointmentCalendar = ({ DoctorID }: AppointmentCalendarProps) => {
    const dispatch = useDispatch();
    const [date, setDate] = useState<Date | null>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const handleDateChange = (value: Date | Date[] | [Date, Date] | null) => {
        if (value instanceof Date) {
            // Format the date using local values to avoid timezone shifts
            const formatDate = (date: Date): string => {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                const dd = String(date.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}`;
            };
            const serializedDate = formatDate(value);
            setDate(value);
            dispatch(setSelectedDate(serializedDate));

            axios
                .get(`/api/appointments/doctor/${DoctorID}/date/${serializedDate}`)
                .then((response) => {
                    dispatch(setAvailableSlots(response.data));
                })
                .catch((error) => {
                    console.error('Error fetching available slots:', error);
                    dispatch(setAvailableSlots([]));
                });
        } else {
            setDate(null);
            dispatch(setSelectedDate(""));
        }
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`/api/appointments/get`);
                setAppointments(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setAppointments([]);
            }
        };

        fetchAppointments();
    }, [DoctorID]);

    return (
        <Box className="appointment-container">
            <Typography variant="h4" gutterBottom>
                Appointment Calendar
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card className="calendar-card">
                        <Typography variant="h6" gutterBottom>
                            <CalendarTodayIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Select a Date
                        </Typography>
                        <Calendar onChange={(value) => {handleDateChange(value as Date | Date[] | [Date, Date] | null)
                                                console.log(value,"date","index")
                                            } }value={date} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className="appointments-card">
                        <Typography variant="h6" gutterBottom>
                            Upcoming Appointments
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {appointments.length > 0 ? (
                            appointments.map((appointment, index) => (
                                <Box key={index} className="appointment-item">
                                    <Typography variant="body1" className="appointment-title">
                                        {appointment.title} - {appointment.time}
                                    </Typography>
                                    <Typography variant="body2" className="appointment-description">
                                        {appointment.description}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No upcoming appointments.
                            </Typography>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AppointmentCalendar;

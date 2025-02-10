import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch } from 'react-redux';
import { setSelectedDate, setAvailableSlots } from '../actions/actions';
import axios from 'axios';
import { CalendarClock } from 'lucide-react';
import './appointmentcalemder.css';
import TimeSlotSelector from './timeSelector'; // Import TimeSlotSelector

interface BookingFormData {
    name: string;
    email: string;
    department: string;
    doctor: string;
    time: string;
    appointmentType: string; // Add appointment type
}

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialty: string;
}

interface Department {
    name: string;
    id: number;
}

// Static appointment types
const appointmentTypes = ["Sur terrain", "distance"];

const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM'
];

const AppointmentCalendar = () => {
    const dispatch = useDispatch();
    const [date, setDate] = useState<Date | null>(new Date());
    const [formData, setFormData] = useState<BookingFormData>({
        name: '',
        email: '',
        department: '',
        doctor: '',
        time: '',
        appointmentType: '' // Initialize appointment type
    });
    const [doctors, setDoctors] = useState<Doctor[]>([]); // State to store doctors
    const [departments, setDepartments] = useState<Department[]>([]); // State to store departments

    // Get the logged-in user's ID (assuming it's stored in Redux or localStorage)
    const patientID = "4"; // Replace with dynamic value if available

    // Fetch departments (specialties) from the database on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/speciality');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    // Fetch doctors when department changes
    useEffect(() => {
        const fetchDoctors = async () => {
            if (formData.department) {
                try {
                    const response = await axios.get(`http://127.0.0.1:5000/api/doctor2/special?specialty=${formData.department}`);
                    console.log(response.data, "response doctors");
                    setDoctors(response.data);
                } catch (error) {
                    console.error('Error fetching doctors:', error);
                    setDoctors([]);
                }
            } else {
                setDoctors([]); // Clear doctors if no department is selected
            }
        };

        fetchDoctors();
    }, [formData.department]); // Re-run effect when formData.department changes

    const handleDateChange = (selectedDate: Date | null) => {
        if (selectedDate) {
            const formatDate = (date: Date): string => {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}`;
            };

            const serializedDate = formatDate(selectedDate);
            setDate(selectedDate);
            dispatch(setSelectedDate(serializedDate));

            // Fetch available slots for the selected date
            axios
                .get(`/api/appointments/doctor/${formData.doctor}/date/${serializedDate}`) // Use formData.doctor instead of DoctorID
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
            dispatch(setAvailableSlots([]));
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="appointment-container">
            <h1 className="page-title">Book an Appointment</h1>
            <div className="grid-container">
                <div className="card">
                    <h2 className="card-title">
                        <CalendarClock className="icon" />
                        Select a Date
                    </h2>
                    <div className="calendar-wrapper">
                        <Calendar
                            onChange={handleDateChange}
                            value={date}
                            minDate={new Date()}
                        />
                    </div>
                </div>
                <div className="card">
                    <h2 className="card-title">Book Appointment</h2>
                    <div className="divider"></div>
                    <form className="form-container">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department" className="form-label">Department</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                                className="form-select"
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="doctor" className="form-label">Doctor</label>
                            <select
                                id="doctor"
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleInputChange}
                                required
                                className="form-select"
                                disabled={!formData.department} // Disable if no department is selected
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {`${doctor.firstName} ${doctor.lastName} (${doctor.specialty})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="appointmentType" className="form-label">Type of Appointment</label>
                            <select
                                id="appointmentType"
                                name="appointmentType"
                                value={formData.appointmentType}
                                onChange={handleInputChange}
                                required
                                className="form-select"
                            >
                                <option value="">Select Type</option>
                                {appointmentTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>
            </div>

            {/* Pass doctorID, patientID, selectedDate, and appointmentType to TimeSlotSelector */}
            {formData.doctor && date && (
                <TimeSlotSelector
                    doctorID={formData.doctor} // Pass the selected doctor's ID
                    patientID={patientID} // Pass the logged-in user's ID
                    selectedDate={date} // Pass the selected date
                    appointmentType={formData.appointmentType} // Pass the selected appointment type
                />
            )}
        </div>
    );
};

export default AppointmentCalendar;
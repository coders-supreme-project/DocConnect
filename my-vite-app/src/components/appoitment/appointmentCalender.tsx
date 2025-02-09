// import { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { useDispatch } from 'react-redux';
// import { setSelectedDate, setAvailableSlots } from '../actions/actions';
// import axios from 'axios';
// import { CalendarClock } from 'lucide-react';
// import "./appointmentcalemder.css"

// interface AppointmentCalendarProps {
//     DoctorID: number;
// }

// interface BookingFormData {
//     name: string;
//     email: string;
//     department: string;
//     time: string;
// }

// const departments = [
//     'Cardiology',
//     'Dermatology',
//     'Neurology',
//     'Orthopedics',
//     'Pediatrics',
//     'General Medicine'
// ];

// const timeSlots = [
//     '09:00 AM',
//     '10:00 AM',
//     '11:00 AM',
//     '02:00 PM',
//     '03:00 PM',
//     '04:00 PM'
// ];

// const AppointmentCalendar = ({ DoctorID }: AppointmentCalendarProps) => {
//     const dispatch = useDispatch();
//     const [date, setDate] = useState<Date | null>(new Date());
//     const [formData, setFormData] = useState<BookingFormData>({
//         name: '',
//         email: '',
//         department: '',
//         time: ''
//     });

//     const handleDateChange = (selectedDate: Date | null) => {
//         if (selectedDate) {
//             const formatDate = (date: Date): string => {
//                 const yyyy = date.getFullYear();
//                 const mm = String(date.getMonth() + 1).padStart(2, "0");
//                 const dd = String(date.getDate()).padStart(2, "0");
//                 return `${yyyy}-${mm}-${dd}`;
//             };

//             const serializedDate = formatDate(selectedDate);
//             setDate(selectedDate);
//             dispatch(setSelectedDate(serializedDate));

//             // Fetch available slots for the selected date
//             axios
//                 .get(`/api/appointments/doctor/${DoctorID}/date/${serializedDate}`)
//                 .then((response) => {
//                     dispatch(setAvailableSlots(response.data));
//                 })
//                 .catch((error) => {
//                     console.error('Error fetching available slots:', error);
//                     dispatch(setAvailableSlots([]));
//                 });
//         } else {
//             setDate(null);
//             dispatch(setSelectedDate(""));
//             dispatch(setAvailableSlots([]));
//         }
//     };

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = event.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
//         try {

//             if (!date) {
//                 alert('Please select a date');
//                 return;
//             }
//             const appointmentData = {
//                 DoctorID: DoctorID,
//                 AppointmentDate: `${date?.toISOString().split('T')[0]} ${formData.time}`,
//                 DurationMinutes: 30
//             };
            
//             console.log('Sending appointment data:', appointmentData);

//             const response = await axios.post('http://localhost:5000/api/appointment/create', appointmentData, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
            
//             if (response.status === 201) {
//                 alert('Appointment booked successfully!');
//                 setFormData({
//                     name: '',
//                     email: '',
//                     department: '',
//                     time: ''
//                 });
//                 setDate(null);
//             }
//         } catch (error: any) {
//             console.error('Detailed error:', error.response?.data || error);
//             alert(`Booking failed: ${error.response?.data?.message || error.message || 'Unknown error'}`);
//         }
//     };

//     return (
//         <div className="appointment-container">
//             <h1 className="page-title">Book an Appointment</h1>
//             <div className="grid-container">
//                 <div className="card">
//                     <h2 className="card-title">
//                         <CalendarClock className="icon" />
//                         Select a Date
//                     </h2>
//                     <div className="calendar-wrapper">
//                         <Calendar 
//                             onChange={handleDateChange}
//                             value={date}
//                             minDate={new Date()}
//                         />
//                     </div>
//                 </div>
//                 <div className="card">
//                     <h2 className="card-title">Book Appointment</h2>
//                     <div className="divider"></div>
//                     <form onSubmit={handleSubmit} className="form-container">
//                         <div className="form-group">
//                             <label htmlFor="name" className="form-label">Full Name</label>
//                             <input
//                                 id="name"
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="form-input"
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="email" className="form-label">Email Address</label>
//                             <input
//                                 id="email"
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="form-input"
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="department" className="form-label">Department</label>
//                             <select
//                                 id="department"
//                                 name="department"
//                                 value={formData.department}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="form-select"
//                             >
//                                 <option value="">Select Department</option>
//                                 {departments.map((dept) => (
//                                     <option key={dept} value={dept}>
//                                         {dept}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="time" className="form-label">Preferred Time</label>
//                             <select
//                                 id="time"
//                                 name="time"
//                                 value={formData.time}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="form-select"
//                             >
//                                 <option value="">Select Time</option>
//                                 {timeSlots.map((slot) => (
//                                     <option key={slot} value={slot}>
//                                         {slot}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <button
//                             type="submit"
//                             className="submit-button"
//                             disabled={!date}
//                         >
//                             Book Appointment
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AppointmentCalendar;
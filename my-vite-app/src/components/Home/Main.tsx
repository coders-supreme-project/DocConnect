import * as React from "react";
const { useState } = React;
import { Play, Search, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TimeSlotSelector from '../appoitment/timeSelector';
import axios from 'axios';
import "./Main.css";
import AppointmentCalendar from '../appoitment/appointmentCalender';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Map from "./Map";

interface NavItem {
    label: string;
    href: string;
}
interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  experience: number;
  bio: string;
  qualifications?: string;
  Availabilities: {
    availableDate?: string;
    startTime?: string;
    endTime?: string;
  }[];
}

const Main: React.FC = () => {
    const [showMap, setShowMap] = useState(false); // Manage Map visibility
    const navigate = useNavigate();
    const navItems: NavItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Service', href: '/service' }, // Updated to point to the correct route
        { label: 'Contact Us', href: '/contact' },
        { label: 'Help', href: '/help' },
        { label: 'Blogs', href: '/blogs' },
    ];

    const [openBookingModal, setOpenBookingModal] = useState(false);
    const [searchParams, setSearchParams] = useState({
        name: '',
        specialization: '',
        city: '',
        zipCode: '',
        availableDate: '',
        availableTime: ''
    });
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/api/doctor/search', { params: searchParams });
            console.log('✅✅', response.data);
            setDoctors(response.data);
        } catch (error) {
            console.error('Error searching for doctors:', error);
        }
    };
    const handleChatWithDoctor = async (doctorId: number) => {
        const patientId = Number(localStorage.getItem("userId")); // Get the logged-in patient ID
    
        if (!patientId) {
            alert("You must be logged in as a Patient to chat with a doctor.");
            return;
        }
    
        try {
            // Make API request to create or fetch the chatroom
            const response = await axios.post("http://localhost:5000/api/chats/create", {
                PatientID: patientId,
                DoctorID: doctorId
            });
    
            // Check if the response contains the chatroom ID
            const chatroomId = response.data.chatroom?.ChatroomID || response.data.chatroom?.id;
    
            if (chatroomId) {
                navigate(`/chatroom/${chatroomId}`); // Redirect to the chatroom
            } else {
                console.error("Chatroom ID not found in response:", response.data);
                alert("Failed to start chat. Chatroom ID not found.");
            }
        } catch (error) {
            console.error("Error starting chat:", error);
            alert("Failed to start chat. Please try again.");
        }
    };

    return (
        <div>
            {/* Navigation */}
            <nav className="nav">
                <div className="nav-container">
                    <div>
                        <span className="nav-logo">Healthcare</span>
                    </div>
                    <div className="nav-links">
                        {navItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="nav-link"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default anchor behavior
                                    navigate(item.href); // Use navigate to change the route
                                }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn btn-outline" onClick={() => navigate("/register")}>Sign Up</button>
                        <button className="btn btn-primary" onClick={() => navigate("/login")}>Log In</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="hero">
                <div className="hero-grid">
                    <div className="hero-content">
                        <h1>
                            Providing Quality <span className="text-teal">Healthcare</span> For A
                            <br />
                            <span className="text-green">Brighter</span> And <span className="text-green">Healthy</span> Future
                        </h1>
                        <p>
                            At Our Hospital, We Are Dedicated To Providing Exceptional
                            Medical Care To Our Patients And Their Families. Our
                            Experienced Team Of Medical Professionals, Cutting-Edge
                            Technology, And Compassionate Approach Make Us A Leader
                            In The Healthcare Industry
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary" onClick={() => setOpenBookingModal(true)}>Book Appointment</button>
                            <button className="watch-btn">
                                <Play size={20} />
                                <span>Watch Video</span>
                            </button>
                        </div>
                    </div>
                    <div className="hero-image-container">
                        <div className="hero-image-bg"></div>
                        <img
                            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80"
                            alt="Doctor"
                            className="hero-image"
                        />
                        <div className="service-badge">
                            <Clock size={20} color="#0d9488" />
                            <span>24/7 Service</span>
                        </div>
                    </div>
                </div>

                {/* Find A Doctor Section */}
                <div className="find-doctor">
                    <h2>Find A Doctor</h2>
                    <button className="btn btn-primary" onClick={() => setShowMap(true)}>Show Map</button>
                    <form onSubmit={handleSearch}>
                        <input type="text" name="name" placeholder="Name" value={searchParams.name} onChange={handleChange} />
                        <input type="text" name="specialization" placeholder="Specialization" value={searchParams.specialization} onChange={handleChange} />
                        <input type="text" name="city" placeholder="City" value={searchParams.city} onChange={handleChange} />
                        <input type="text" name="zipCode" placeholder="Zip Code" value={searchParams.zipCode} onChange={handleChange} />
                        <input type="date" name="availableDate" value={searchParams.availableDate} onChange={handleChange} />
                        <input type="time" name="availableTime" value={searchParams.availableTime} onChange={handleChange} />
                        <button type="submit" className="btn btn-sm btn-primary search-btn px-2 py-1 text-sm">
                            <Search size={16} /> {/* Reduced icon size */}
                            <span className="ml-1">Search</span> {/* Adjusted spacing */}
                        </button>
                    </form>

                    <div className="search-results">
                        {doctors?.map(doctor => (
                            <div key={doctor.id} className="doctor-profile">
                                <h3>{doctor.firstName} {doctor.lastName}</h3>
                                <p>Specialty: {doctor.specialty}</p>
                                <p>Experience: {doctor.experience} years</p>
                                <p>Qualifications: {doctor.qualifications}</p>
                                <h4>Availabilities:</h4>
                                <button onClick={() => handleChatWithDoctor(doctor.id)}>Chat With Doctor</button>
                                <ul>
                                    {doctor.Availabilities.map((availability, index) => (
                                        <li key={index}>
                                            {availability.availableDate} from {availability.startTime} to {availability.endTime}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={openBookingModal} onClose={() => setOpenBookingModal(false)} fullWidth maxWidth="md">
                <DialogTitle>Book an Appointment</DialogTitle>
                <DialogContent>
                    <AppointmentCalendar/>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBookingModal(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Map Popup */}
            <Dialog open={showMap} onClose={() => setShowMap(false)} fullWidth maxWidth="md">
                <DialogTitle>Map</DialogTitle>
                <DialogContent>
                    <Map />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowMap(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Main;
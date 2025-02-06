import React, { useState } from 'react';
import { Play, Search, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TimeSlotSelector from './appoitment/timeSelector';
import axios from 'axios';
import "./Main.css";
import AppointmentCalendar from './appoitment/appointmentCalender';
import { Typography } from '@mui/material';

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
  const navItems: NavItem[] = [
    { label: 'Home', href: '#' },
    { label: 'Service', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Help', href: '#' },
    { label: 'Blogs', href: '#' },
  ];
  const navigate=useNavigate()
const DoctorID:number=2
  const [searchParams, setSearchParams] = useState({
    name: '',
    specialization: '',
    city: '',
    zipCode: '',
    availableDate: '',
    availableTime: ''
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

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
      // console.log('👩‍⚕️👨‍⚕️', doctors);
      
    } catch (error) {
      console.error('Error searching for doctors:', error);
    }
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
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
              <a key={index} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </div>
          <div className="nav-buttons">
            <button className="btn btn-outline">Sign Up</button>
            <button className="btn btn-primary" onClick={()=>{navigate('/login')}}>Log In</button>
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
              <button className="btn btn-primary">Appointments</button>
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

        {/* Move appointment section here, right after hero */}
        <div className="appointment-section">
          <Typography variant="h4" gutterBottom>
            Book an Appointment
          </Typography>
          <AppointmentCalendar DoctorID={DoctorID} />
          <TimeSlotSelector 
            doctorId={DoctorID.toString()}
            patientId="123"
          />
        </div>

        {/* Find A Doctor Section */}
        <div className="find-doctor">
          <h2>Find A Doctor</h2>
          <form onSubmit={handleSearch}>
            <input type="text" name="name" placeholder="Name" value={searchParams.name} onChange={handleChange} />
            <input type="text" name="specialization" placeholder="Specialization" value={searchParams.specialization} onChange={handleChange} />
            <input type="text" name="city" placeholder="City" value={searchParams.city} onChange={handleChange} />
            <input type="text" name="zipCode" placeholder="Zip Code" value={searchParams.zipCode} onChange={handleChange} />
            <input type="date" name="availableDate" value={searchParams.availableDate} onChange={handleChange} />
            <input type="time" name="availableTime" value={searchParams.availableTime} onChange={handleChange} />
            <button type="submit" className="btn btn-primary search-btn">
              <Search size={20} />
              <span>Search</span>
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
                <ul>
                  {doctor.Availabilities.map((availability, index) => (
                    <li key={index}>
                      {availability.availableDate} from {availability.startTime} to {availability.endTime}
                    </li>
                  ))}
                </ul>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  Select Doctor
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
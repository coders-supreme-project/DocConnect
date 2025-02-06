import React, { useState } from 'react';
import { Play, Search, Clock } from 'lucide-react';
import "./Main.css";
import Map from "./Map";
import '../styles.css';

interface NavItem {
    label: string;
    href: string;
}

const doctorId: number = 2;

const Main: React.FC = () => {
    const [showMap, setShowMap] = useState(false); // Manage Map visibility

    const navItems: NavItem[] = [
        { label: 'Home', href: '#' },
        { label: 'Service', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Help', href: '#' },
        { label: 'Blogs', href: '#' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle search logic here
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
                        {navItems.map((item) => (
                            <a key={item.label} href={item.href} className="nav-item">
                                {item.label}
                            </a>
                        ))}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn btn-outline">Sign Up</button>
                        <button className="btn btn-primary">Log In</button>
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

                {/* Toggle Button for Map */}
                <div className="map-toggle">
                    <button className="btn btn-secondary" onClick={() => setShowMap(!showMap)}>
                        {showMap ? "Hide Map" : "Show Map"}
                    </button>
                </div>

                {/* Conditionally Render Map */}
                {showMap && <Map />}

                {/* Find A Doctor Section */}
                <div className="find-doctor">
                    <h2>Find A Doctor</h2>
                    <form onSubmit={handleSearch} className="search-form">
                        <input type="text" placeholder="Name" className="search-input" />
                        <input type="text" placeholder="Specialty" className="search-input" />
                        <button type="submit" className="btn btn-primary search-btn">
                            <Search size={20} />
                            <span>Search</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Main;

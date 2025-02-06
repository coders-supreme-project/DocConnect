import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Settings,
  MessageSquare,
  LayoutGrid,
  LogOut,
  Heart,
  Thermometer,
  Wind,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import './ProfilDoctor.css';

interface Patient {
  id: string;
  name: string;
  initials: string;
  visitType: string;
  time: string;
  status?: string;
}

const mockPatients: Patient[] = [
  { id: '1', name: 'Stacy Mitchell', initials: 'SM', visitType: 'Weekly Visit', time: '9:15 AM' },
  { id: '2', name: 'Amy Dunham', initials: 'AD', visitType: 'Routine Checkup', time: '9:30 AM' },
  { id: '3', name: 'Demi Joan', initials: 'DJ', visitType: 'Weekly Visit', time: '9:50 AM', status: 'Report' },
  { id: '4', name: 'Susan Myers', initials: 'SM', visitType: 'Weekly Visit', time: '10:15 AM' },
];

function Profile() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <div className="profile-container">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <LayoutGrid className="sidebar-icon active" />
          <Calendar className="sidebar-icon" />
          <MessageSquare className="sidebar-icon" />
          <Settings className="sidebar-icon" />
        </nav>
        <div className="sidebar-spacer" />
        <LogOut className="sidebar-icon" />
      </aside>

      <main className="main-content">
        <header className="profile-header">
          <h1>Welcome, <span>Dr. Kim</span></h1>
          <div className="header-actions">
            <Bell className="header-icon" />
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60"
              alt="Profile"
              className="profile-img"
            />
          </div>
        </header>

        <section className="stats-section">
          <div className="stats-card">
            <h2>Today's Visits</h2>
            <p className="stats-total">104</p>
            <div className="stats-grid">
              <div className="stat-box">
                <span>New Patients</span>
                <p>40 <TrendingUp className="trend-up" /> 51%</p>
              </div>
              <div className="stat-box">
                <span>Old Patients</span>
                <p>64 <TrendingDown className="trend-down" /> 24%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="patient-list">
          <h2>Today's Patients</h2>
          {mockPatients.map((patient) => (
            <div key={patient.id} className="patient-card" onClick={() => setSelectedPatient(patient)}>
              <div className="patient-avatar">{patient.initials}</div>
              <div className="patient-info">
                <h3>{patient.name}</h3>
                <p>{patient.visitType} at {patient.time}</p>
              </div>
              {patient.status && <span className="patient-status">{patient.status}</span>}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Profile;
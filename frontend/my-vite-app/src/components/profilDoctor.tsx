import React, { useState } from 'react';
import { Bell, Calendar, Settings, MessageSquare, LayoutGrid, LogOut, Heart, Thermometer, Wind, TrendingUp, TrendingDown } from 'lucide-react';
import type { Patient, ConsultationDetails } from "./types";

const mockPatients: Patient[] = [
  { id: '1', name: 'Stacy Mitchell', initials: 'SM', visitType: 'Weekly Visit', time: '9:15 AM' },
  { id: '2', name: 'Amy Dunham', initials: 'AD', visitType: 'Routine Checkup', time: '9:30 AM' },
  { id: '3', name: 'Demi Joan', initials: 'DJ', visitType: 'Weekly Visit', time: '9:50 AM', status: 'Report' },
  { id: '4', name: 'Susan Myers', initials: 'SM', visitType: 'Weekly Visit', time: '10:15 AM' },
];

const mockConsultation: ConsultationDetails = {
  patientName: 'Denzel White',
  initials: 'DW',
  gender: 'Male',
  age: '28 Years 3 Months',
  symptoms: [
    { id: '1', name: 'Fever', value: 102, icon: 'temperature' },
    { id: '2', name: 'Cough', value: 85, icon: 'cough' },
    { id: '3', name: 'Heart Burn', value: 75, icon: 'heart' },
  ],
  lastChecked: {
    doctor: 'Everly',
    date: '21 April 2021',
    prescriptionId: '2293xK10',
  },
  observation: 'High fever and cough at normal hemoglobin levels.',
  prescriptions: [
    'Paracetmol - 2 times a day',
    'Diazepam - Day and Night before meal',
    'Wilexyl',
  ],
};

function App() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <div className="app">
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

      <main className="main">
        <header className="header">
          <h1 className="greeting">
            Good Morning <span>Dr. Kim!</span>
          </h1>
          <div className="header-actions">
            <button className="notification-btn">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60"
              alt="Profile"
              className="profile-img"
            />
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="stats-card">
              <h2 className="stats-title">Visits for Today</h2>
              <div className="stats-total">104</div>
              
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-header">
                    <span className="stat-label">New Patients</span>
                    <div className="stat-trend trend-up">
                      <TrendingUp size={16} />
                      51%
                    </div>
                  </div>
                  <div className="stat-value">40</div>
                </div>
                
                <div className="stat-box">
                  <div className="stat-header">
                    <span className="stat-label">Old Patients</span>
                    <div className="stat-trend trend-down">
                      <TrendingDown size={16} />
                      20%
                    </div>
                  </div>
                  <div className="stat-value">64</div>
                </div>
              </div>
            </div>

            <div className="patient-list">
              <div className="list-header">
                <h2 className="list-title">Patient List</h2>
                <select className="list-filter">
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This Week</option>
                </select>
              </div>
              
              <div className="patient-items">
                {mockPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className="patient-item"
                  >
                    <div className={`patient-avatar avatar-${patient.initials[0].toLowerCase()}`}>
                      {patient.initials}
                    </div>
                    <div className="patient-info">
                      <h3 className="patient-name">{patient.name}</h3>
                      <p className="patient-visit">{patient.visitType}</p>
                    </div>
                    <div className="patient-time">
                      <div className="patient-time-value">{patient.time}</div>
                      {patient.status && (
                        <span className="patient-status">{patient.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-side">
            <h2 className="list-title">Consultation</h2>
            <div className="consultation">
              <div className="consultation-header">
                <div className="consultation-patient">
                  <div className="consultation-avatar">
                    {mockConsultation.initials}
                  </div>
                  <div className="consultation-info">
                    <h3 className="consultation-name">{mockConsultation.patientName}</h3>
                    <p className="consultation-details">
                      {mockConsultation.gender} - {mockConsultation.age}
                    </p>
                  </div>
                </div>
                <button className="menu-btn">•••</button>
              </div>

              <div className="symptoms-grid">
                {mockConsultation.symptoms.map((symptom) => (
                  <div key={symptom.id} className="symptom-card">
                    <div className={`symptom-icon ${symptom.icon}`}>
                      {symptom.icon === 'temperature' && <Thermometer size={20} />}
                      {symptom.icon === 'cough' && <Wind size={20} />}
                      {symptom.icon === 'heart' && <Heart size={20} />}
                    </div>
                    <div className="symptom-value">{symptom.value}</div>
                    <div className="symptom-name">{symptom.name}</div>
                  </div>
                ))}
              </div>

              <div className="consultation-section">
                <h4 className="section-label">Last Checked</h4>
                <p>
                  Dr {mockConsultation.lastChecked.doctor} on {mockConsultation.lastChecked.date}
                  <span className="prescription-id">#{mockConsultation.lastChecked.prescriptionId}</span>
                </p>
              </div>

              <div className="consultation-section">
                <h4 className="section-label">Observation</h4>
                <p>{mockConsultation.observation}</p>
              </div>

              <div className="consultation-section">
                <h4 className="section-label">Prescription</h4>
                <ul className="prescription-list">
                  {mockConsultation.prescriptions.map((prescription, index) => (
                    <li key={index}>{prescription}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Render selected patient details if available */}
        {selectedPatient && (
          <div className="selected-patient-details">
            <h2>Selected Patient</h2>
            <p>Name: {selectedPatient.name}</p>
            <p>Visit Type: {selectedPatient.visitType}</p>
            <p>Appointment Time: {selectedPatient.time}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

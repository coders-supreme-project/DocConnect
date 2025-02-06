import { TrendingUp, TrendingDown, Calendar, Bell, UserCircle } from 'lucide-react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate=useNavigate()
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-icons">
          <div className="sidebar-icon" />
          <div className="sidebar-icon" />
          <div className="sidebar-icon" />
          <div className="sidebar-icon" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <input type="text" placeholder="Search" className="search-bar" />
          <div className="header-actions">
            <Bell className="header-icon" />
            <UserCircle className="header-icon" onClick={()=>navigate("/profile")} />
          </div>
        </header>

        {/* Greeting */}
        <div className="greeting-card">
          <h2>Good Morning, <span className="doctor-name">Dr. Kim!</span></h2>
        </div>

        {/* Stats */}
        <div className="stats-container">
          <div className="stats-box">
            <h3>Visits for Today</h3>
            <p className="stats-total">104</p>
            <div className="stats-details">
              <div className="stats-item">
                <span>New Patients</span>
                <p>40 <TrendingUp className="trend-up" /> 51%</p>
              </div>
              <div className="stats-item">
                <span>Old Patients</span>
                <p>64 <TrendingDown className="trend-down" /> 24%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="patient-list">
          <h3>Patient List - Today</h3>
          <div className="patient-item">Stacy Mitchell <span>9:15 AM</span></div>
          <div className="patient-item">Amy Dunham <span>9:30 AM</span></div>
          <div className="patient-item">Demi Joan <span>9:50 AM</span></div>
          <div className="patient-item">Susan Myers <span>10:15 AM</span></div>
        </div>
      </main>

      {/* Sidebar Right */}
      <aside className="sidebar-right">
        <div className="calendar-box">
          <h3>Calendar</h3>
          <Calendar />
        </div>
      </aside>
    </div>
  );
}
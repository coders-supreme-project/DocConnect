import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import AppointmentList from './components/appoitment/appointmentList'; // Correct path for 'appointment'
import AppointmentForm from './components/appoitment/appointment'; // Correct path for 'appointment'
import AppointmentDetail from './components/appoitment/appointmentDetail'; // Correct path for 'appointment'

function App() {
  return (
    <BrowserRouter>
      <h1>Appointment Management</h1> {/* Moved title outside of Routes */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/appointments/create" element={<AppointmentForm />} />
        <Route path="/appointments/:id" element={<AppointmentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

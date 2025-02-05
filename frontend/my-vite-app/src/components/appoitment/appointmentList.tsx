// src/components/AppointmentList.tsx
import React, { useEffect, useState } from 'react';
import { getAppointments, Appointment } from '../api/appointmentApi';
import { Link } from 'react-router-dom';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        setAppointments(response.data);
      } catch (err) {
        setError('Error fetching appointments');
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>Appointments</h2>
      {error && <p>{error}</p>}
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.AppointmentID}>
            <Link to={`/appointments/${appointment.AppointmentID}`}>
              {appointment.AppointmentDate} - {appointment.Doctor.FirstName} {appointment.Doctor.LastName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;

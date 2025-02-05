import React, { useEffect, useState } from 'react';
import { getAppointmentById, updateAppointment, deleteAppointment, Appointment } from '../api/appointmentApi';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) {
        setError('Appointment ID is missing');
        return;
      }

      try {
        const response = await getAppointmentById(id);
        setAppointment(response.data);
      } catch (err) {
        setError('Error fetching appointment details');
      }
    };

    fetchAppointment();
  }, [id]);

  const handleUpdate = async () => {
    if (!appointment) return;

    const updatedData = { ...appointment, Status: 'confirmed' };
    if (!id) {
        setError('Appointment ID is missing');
        return;
      }
    try {
      await updateAppointment(id, updatedData);
      navigate('/appointments'); // Use navigate instead of history.push
    } catch (err) {
      setError('Error updating appointment');
    }
  };

  const handleDelete = async () => {
    if (!id) {
        setError('Appointment ID is missing');
        return;
      }
    try {
      await deleteAppointment(id);
      navigate('/appointments');  // Use navigate instead of history.push
    } catch (err) {
      setError('Error deleting appointment');
    }
  };

  if (!appointment) return <div>Loading...</div>;  // Can replace this with a spinner for better UX

  return (
    <div>
      <h2>Appointment Details</h2>
      {error && <p>{error}</p>}
      <p>Doctor: {appointment.Doctor.FirstName} {appointment.Doctor.LastName}</p>
      <p>Patient: {appointment.Patient.FirstName} {appointment.Patient.LastName}</p>
      <p>Date: {appointment.AppointmentDate}</p>
      <p>Status: {appointment.Status}</p>
      <button onClick={handleUpdate}>Confirm Appointment</button>
      <button onClick={handleDelete}>Delete Appointment</button>
    </div>
  );
};

export default AppointmentDetail;

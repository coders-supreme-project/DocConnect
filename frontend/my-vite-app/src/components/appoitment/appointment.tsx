import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // Import necessary hooks
import { getAppointmentById, createAppointment, updateAppointment, AppointmentFormData } from '../api/appointmentApi';

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();  // UseParams to get the appointment id
  const [formData, setFormData] = useState<AppointmentFormData>({
    DoctorID: 0,
    AppointmentDate: '',
    DurationMinutes: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch the appointment details if editing an existing appointment
  useEffect(() => {
    if (id) {
      const fetchAppointment = async () => {
        try {
          const response = await getAppointmentById(id);
          setFormData({
            DoctorID: response.data.DoctorID,
            AppointmentDate: response.data.AppointmentDate,
            DurationMinutes: response.data.DurationMinutes,
          });
        } catch (err) {
          setError('Error fetching appointment details');
        }
      };
      fetchAppointment();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        // Update the appointment if there's an id
        await updateAppointment(id, formData as any);  // Adjust if necessary for types
        navigate('/appointments');
      } else {
        // Create a new appointment if there's no id
        await createAppointment(formData);
        navigate('/appointments');
      }
    } catch (err) {
      setError('Error saving appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{id ? 'Update Appointment' : 'Create Appointment'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="DoctorID">Doctor:</label>
          <input
            type="number"
            id="DoctorID"
            name="DoctorID"
            value={formData.DoctorID}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="AppointmentDate">Appointment Date:</label>
          <input
            type="datetime-local"
            id="AppointmentDate"
            name="AppointmentDate"
            value={formData.AppointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="DurationMinutes">Duration (in minutes):</label>
          <input
            type="number"
            id="DurationMinutes"
            name="DurationMinutes"
            value={formData.DurationMinutes}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : id ? 'Update Appointment' : 'Create Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;

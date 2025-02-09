// src/api/appointmentApi.ts
import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api/appointments'; // Replace with your backend URL

// Interfaces for the data types
export interface Appointment {
  AppointmentID: number;
  DoctorID: number;
  PatientID: number;
  AppointmentDate: string;
  DurationMinutes: number;
  Status: string;
  Doctor: {
    UserID: number;
    FirstName: string;
    LastName: string;
  };
  Patient: {
    UserID: number;
    FirstName: string;
    LastName: string;
  };
}

export interface AppointmentFormData {
  DoctorID: number;
  AppointmentDate: string;
  DurationMinutes: number;
}

// Get all appointments
export const getAppointments = async (): Promise<AxiosResponse<Appointment[]>> => {
  return axios.get(`${API_URL}/all`, { headers: getAuthHeaders() });
};

// Create an appointment
export const createAppointment = async (
  appointmentData: AppointmentFormData
): Promise<AxiosResponse<Appointment>> => {
  return axios.post(`${API_URL}/create`, appointmentData, { headers: getAuthHeaders() });
};

// Get a single appointment by ID
export const getAppointmentById = async (id: string): Promise<AxiosResponse<Appointment>> => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

// Update an appointment
export const updateAppointment = async (
  id: string,
  appointmentData: Appointment
): Promise<AxiosResponse<Appointment>> => {
  return axios.put(`${API_URL}/update/${id}`, appointmentData, { headers: getAuthHeaders() });
};

// Delete an appointment
export const deleteAppointment = async (id: string): Promise<AxiosResponse> => {
  return axios.delete(`${API_URL}/delete/${id}`, { headers: getAuthHeaders() });
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken'); // Store token after login
  return token ? { Authorization: `Bearer ${token}` } : {};
};

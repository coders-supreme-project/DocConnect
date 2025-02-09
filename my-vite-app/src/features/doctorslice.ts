import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Doctor interface (you may adjust based on your actual API structure)
export interface Doctor {
  id: number;
  FirstName: string;
  LastName: string;
  Speciality: string;
  MeetingPrice: number;
  Bio: string;
  avatarUrl?: string; // Optional property added for the doctor's avatar URL
  email?: string;     // Add email property (optional or required based on your API)
  phone?: string;     // Add phone if used in the component
  experience?: number; // Add experience if needed
  LocationLatitude?: number;
  LocationLongitude?: number;
}

export interface Appointment {
  id: number;
  date: string;
  patientName: string;
  timeSlot: string;
  status: string;
}

// State interface to include appointments
interface DoctorState {
  doctor: Doctor | null;
  appointments: any; // Add appointments array
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  doctor: null,
  appointments: [], // Initialize appointments
  loading: false,
  error: null,
};

// Async thunk to fetch doctor by ID
export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (id: number) => {
    const response = await axios.get(`http://localhost:5000/api/doctor/${id}`);
    return response.data;
  }
);

// Async thunk to update doctor profile
export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateDoctorProfile",
  async (doctorData: {
    id: number;
    FirstName: string;
    LastName: string;
    Speciality: string;
    MeetingPrice: number;
    Bio: string;
  }) => {
    const response = await axios.put(
      `/api/doctors/${doctorData.id}`,
      doctorData
    );
    return response.data;
  }
);

// Async thunk to fetch doctor appointments
export const getDocAppointments = createAsyncThunk(
  "doctor/getDocAppointments",
  async (id: number) => {
    const response = await axios.post(
      `http://localhost:5000/api/appointments/doctor`,
      { id }
    );
    return response.data; // Assuming API returns an array of appointments
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.doctor = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch doctor";
        state.loading = false;
      })
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.doctor = action.payload;
        state.loading = false;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update doctor profile";
        state.loading = false;
      })
      .addCase(getDocAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDocAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload; // Store appointments
        state.loading = false;
      })
      .addCase(getDocAppointments.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch appointments";
        state.loading = false;
      });
  },
});

export default doctorSlice.reducer;

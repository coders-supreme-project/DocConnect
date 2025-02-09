import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

// Types
export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  bio: string;
  profilePicture?: string;
  isVerified: boolean;
  LocationLatitude?: number;
  LocationLongitude?: number;
}

export interface Appointment {
  id: number;
  date: string;
  patientName: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  patientId: number;
  doctorId: number;
}

interface CustomJwtPayload extends JwtPayload {
  id?: string;
  userId?: string;
  sub?: string;
}

interface DoctorState {
  doctor: Doctor | null;
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DoctorState = {
  doctor: null,
  appointments: [],
  loading: false,
  error: null,
};

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError.response?.data?.message || axiosError.message;
  }
  return 'An unexpected error occurred';
};

// Async thunks
export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userId = decodedToken?.id || decodedToken?.userId || decodedToken?.sub;

      if (!userId) {
        throw new Error("User ID not found in token");
      }

      const response = await axios.get<Doctor>(
        `http://localhost:5000/api/doctor/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

interface UpdateDoctorProfilePayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  bio: string;
  LocationLatitude?: number;
  LocationLongitude?: number;
}

export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateDoctorProfile",
  async (doctorData: UpdateDoctorProfilePayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put<Doctor>(
        `http://localhost:5000/api/doctor/${doctorData.id}`,
        doctorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getDocAppointments = createAsyncThunk(
  "doctor/getDocAppointments",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<Appointment[]>(
        `http://localhost:5000/api/appointments/doctor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Slice
const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },
    clearDoctorState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Doctor
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.doctor = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch doctor profile';
      })

      // Update Doctor Profile
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.doctor = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update doctor profile';
      })

      // Fetch Appointments
      .addCase(getDocAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDocAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.appointments = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getDocAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch appointments';
      });
  },
});

export const { clearDoctorError, clearDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
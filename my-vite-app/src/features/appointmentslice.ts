import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  id?: string;
  userId?: string;
  sub?: string;
}

interface AppointmentsState {
  appointments: any[];
  loadingApp: boolean;
  errorApp: string | null;
  selectedDate: string | null;
  notFound: boolean;  // New state to handle "not found" case
}

const initialState: AppointmentsState = {
  appointments: [],
  loadingApp: false,
  errorApp: null,
  selectedDate: null,
  notFound: false,
};

export const fetchAppointmentsByUserId = createAsyncThunk(
  "appointments/fetchAppointmentsByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userId =   decodedToken?.id || decodedToken?.userId;
      
      if (!userId) {
        throw new Error("User ID not found in token");
      }

      const response = await axios.get(
        `http://localhost:5000/api/appointment/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        // Return a structured error object
        return rejectWithValue({
          message,
          notFound: status === 404
        });
      }
      
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        notFound: false
      });
    }
  }
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearAppointmentsState: (state) => {
      state.errorApp = null;
      state.notFound = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentsByUserId.pending, (state) => {
        state.loadingApp = true;
        state.errorApp = null;
        state.notFound = false;
      })
      .addCase(fetchAppointmentsByUserId.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loadingApp = false;
        state.errorApp = null;
        state.notFound = false;
      })
      .addCase(fetchAppointmentsByUserId.rejected, (state, action) => {
        state.loadingApp = false;
        const payload = action.payload as { message: string; notFound: boolean };
        
        state.notFound = payload?.notFound || false;
        state.errorApp = payload?.message || 'Failed to fetch appointments';
        state.appointments = [];
      });
  },
});

export const { clearAppointmentsState } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
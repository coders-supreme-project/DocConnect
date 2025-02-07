import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    UserID: number;
    Role: "Doctor" | "Patient";
    LocationLatitude?: number;
    LocationLongitude?: number;
    Username?: string; // Add Username to the user object
    FirstName?: string; // Add FirstName to the user object
  };
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  username: string;
  password: string;
  email: string;
  role: "Doctor" | "Patient";
  specialty?: string;
  bio?: string;
  meetingPrice?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  user?: AuthResponse["user"];
  registerSuccess: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  user: undefined,
  registerSuccess: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", userData);
      return response.data;
    } catch (error: any) {
      console.error("Registration API error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", userData);
      return response.data;
    } catch (error: any) {
      console.error("Login API error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = undefined;
      localStorage.removeItem("token");
      localStorage.removeItem("role"); // Clear role from localStorage
      localStorage.removeItem("userId"); // Clear userId from localStorage
      localStorage.removeItem("username"); // Clear username from localStorage
      localStorage.removeItem("firstName"); // Clear firstName from localStorage
    },
    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token || null;
        state.user = action.payload.user;

        // Store token, role, userId, username, and firstName in localStorage
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (action.payload.user) {
          localStorage.setItem("role", action.payload.user.Role);
          localStorage.setItem("userId", action.payload.user.UserID.toString());
          if (action.payload.user.Username) {
            localStorage.setItem("username", action.payload.user.Username);
          }
          if (action.payload.user.FirstName) {
            localStorage.setItem("firstName", action.payload.user.FirstName);
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.registerSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.registerSuccess = false;
      });
  },
});

export const { logout, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
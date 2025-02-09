import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import for ES modules


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
  userId: number | null;
  role: "Patient" | "Doctor" | null;
  token: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  userId: null,
  role: null,
  token: null,
  firstName: null,
  lastName: null,
  email: null,
  phone: null,
  isAuthenticated: false,
  loading: false,
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
    registerStart: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;

      try {
        // ✅ Decode the token to extract user information
        const decoded: any = jwtDecode(action.payload.token);
        state.userId = decoded.id;
        state.role = decoded.role;
        state.firstName = decoded.firstName;
        state.lastName = decoded.lastName;
        state.email = decoded.email;
        state.phone = decoded.phone;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    },
    registerFailure: (state) => {
      state.loading = false;
    },
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;

      try {
        // ✅ Decode the token to extract user information
        const decoded: any = jwtDecode(action.payload.token);
        state.userId = decoded.id;
        state.role = decoded.role;
        state.firstName = decoded.firstName;
        state.lastName = decoded.lastName;
        state.email = decoded.email;
        state.phone = decoded.phone;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.role = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.phone = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    updateUserInfo: (
      state,
      action: PayloadAction<{ firstName: string; lastName: string; email: string; phone: string }>
    ) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
    },
  },
});

// Export actions and reducer
export const { registerStart, registerSuccess, registerFailure, loginStart, loginSuccess, loginFailure, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
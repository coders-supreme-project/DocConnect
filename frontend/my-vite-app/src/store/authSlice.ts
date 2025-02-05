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
    };
  }
  
  interface LoginPayload {
    email: string;
    password: string;
  }

  interface RegisterPayload {
    FirstName: string;
    Username: string;
    Password: string;
    Email: string;
    Role: "Doctor" | "Patient";
    Specialty?: string;
    Bio?: string;
    MeetingPrice?: string;
    Latitude?: number | null;
    Longitude?: number | null;
  }

  interface LoginResponse {
    message: string;
    token?: string;
    user?: {
      UserID: number;
      Role: "Doctor" | "Patient";
      LocationLatitude?: number;
      LocationLongitude?: number;
    };
  }

  interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;
    user?: LoginResponse["user"];
    registerSuccess: boolean;
  }

  const initialState: AuthState = {
    token: null,
    loading: false,
    error: null,
    user: undefined,
    registerSuccess: false,
  };

  export const register = createAsyncThunk(
    "auth/register",
    async (userData: RegisterPayload, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/register",
          userData
        );
        return response.data;
      } catch (error: any) {
        console.error("Registration API error:", error.response?.data);
        return rejectWithValue(
          error.response?.data?.message || "Registration failed"
        );
      }
    }
  );

  export const login = createAsyncThunk(
    "auth/login",
    async (userData: LoginPayload, { rejectWithValue }) => {
      try {
        const response = await axios.post("http://localhost:5000/api/users/login", {
          Email: userData.email,
          Password: userData.password,
        });
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
      },
      resetRegisterSuccess: (state) => {
        state.registerSuccess = false;
      },
    },
    extraReducers: (builder) => {
      builder
        // Login cases
        .addCase(login.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.token = action.payload.token || null;
          state.user = action.payload.user;
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        // Register cases
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
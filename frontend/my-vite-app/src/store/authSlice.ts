import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Define types for login payload & response
interface LoginPayload {
  email: string;
  password: string;
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
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  user: undefined,
};

// ✅ Async action for login
export const login = createAsyncThunk(
  "auth/login",
  async (userData: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        Email: userData.email, // ✅ Ensure correct field name
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
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
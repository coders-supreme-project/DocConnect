import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  role: "Doctor" | "Patient";
  speciality?: string;
  bio?: string;
  meetingPrice?: number;
  latitude?: number;
  longitude?: number;
}

const initialState: RegisterFormData = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  role: "Patient",
  speciality: "",
  bio: "",
  meetingPrice: 0,
  latitude: undefined,
  longitude: undefined,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setEmailOrUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setUserType: (state, action: PayloadAction<"Doctor" | "Patient">) => {
      state.role = action.payload;
    },
    setSpeciality: (state, action: PayloadAction<string>) => {
      state.speciality = action.payload;
    },
    setBio: (state, action: PayloadAction<string>) => {
      state.bio = action.payload;
    },
    setMeetingPrice: (state, action: PayloadAction<number>) => {
      state.meetingPrice = action.payload;
    },
    setLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    resetForm: () => initialState,
  },
});

export const {
  setFirstName,
  setLastName,
  setEmailOrUsername,
  setPassword,
  setConfirmPassword,
  setUserType,
  setSpeciality,
  setBio,
  setMeetingPrice,
  setLocation,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;

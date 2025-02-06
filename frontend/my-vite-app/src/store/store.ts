import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import formReducer from "../store/formSlice";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import userLocationReducer from "./userLocation"

// Define the type for the appointment slice state
interface AppointmentState {
    selectedDate: string;
    availableSlots: string[];
}

const initialAppointmentState: AppointmentState = {
    selectedDate: '',
    availableSlots: [],
};

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: initialAppointmentState,
    reducers: {
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setAvailableSlots: (state, action: PayloadAction<string[]>) => {
            state.availableSlots = action.payload;
        },
    },
});

const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    appointment: appointmentSlice.reducer,
    userLocation: userLocationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
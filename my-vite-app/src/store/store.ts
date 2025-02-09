import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import formReducer from "../store/formSlice";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import userLocationReducer from "./userLocation"
import doctorsReducer from "../features/doctorslice";
import appointmentReducer from "../features/appointmentslice";
import userReducer from '../features/userslice';
import  sessionReducer  from "../features/sessionslice"
import selectedServiceReducer from '../features/selctedserviceslice';

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
    appointment: appointmentReducer,
    userLocation: userLocationReducer,
    // userProfile: userProfileReducer,
    // form: formReducer,
    users: userReducer, // Add the user reducer to the store
    doctor: doctorsReducer,
    // contactForm: contactFormReducer,
    // userLocation: userLocationReducer,
    // Auth: authReducer, // Add the auth reducer to the store
    session: sessionReducer,
    selectedService: selectedServiceReducer,
    
    // findDoctor: findDoctorReducer,
    // services: servicesReducer,
   
    // testimonials: testimonialsReducer,
    // selectedDoctor: selectedDoctorReducer,
    // selectedService: selectedServiceReducer,
    // map: mapReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
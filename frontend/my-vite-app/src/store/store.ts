import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import formReducer from "../store/formSlice";
import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: {
        selectedDate: '',
        availableSlots: [],
    },
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        },
        setAvailableSlots: (state, action) => {
            state.availableSlots = action.payload;
        },
    },
});

const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    appointment: appointmentSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
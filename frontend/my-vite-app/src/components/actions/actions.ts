import { BOOK_APPOINTMENT, SET_SELECTED_DATE, SET_AVAILABLE_SLOTS } from '../types/types';
import { createAction } from '@reduxjs/toolkit';

interface BookAppointmentAction {
    type: typeof BOOK_APPOINTMENT;
    payload: { doctorId: string; patientId: string; slot: string };
}

interface SetSelectedDateAction {
    type: typeof SET_SELECTED_DATE;
    payload: string | null // 👈 Changed to string
}

interface SetAvailableSlotsAction {
    type: typeof SET_AVAILABLE_SLOTS;
    payload: string[];
}

export const bookAppointment = createAction<{
    doctorId: string;
    patientId: string;
    slot: string;
}>('appointment/bookAppointment');

export const setSelectedDate = createAction<string>('appointment/setSelectedDate');

export const setAvailableSlots = createAction<any[]>('appointment/setAvailableSlots');

export type AppointmentActions = BookAppointmentAction | SetSelectedDateAction | SetAvailableSlotsAction;

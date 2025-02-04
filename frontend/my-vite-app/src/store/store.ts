// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './CounterSlice';  // The counter slice you will create

const store = configureStore({
  reducer: {
    counter: counterReducer,  // Add reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;  // For typing the state
export type AppDispatch = typeof store.dispatch;  // For dispatching actions

export default store;

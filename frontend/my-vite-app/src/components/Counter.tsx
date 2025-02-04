// src/store/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type of the state
interface CounterState {
  value: number;
}

// Set initial state
const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Export actions to be dispatched
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Export the reducer to be used in the store
export default counterSlice.reducer;

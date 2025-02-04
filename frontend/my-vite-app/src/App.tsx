// src/components/Counter.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './store/CounterSlice';
import { RootState, AppDispatch } from './store/store';  // Import types

const Counter = () => {
  // Access the state using useSelector
  const count = useSelector((state: RootState) => state.counter.value);
  
  // Access the dispatch function
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
};

export default Counter;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import formReducer from "../store/formSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
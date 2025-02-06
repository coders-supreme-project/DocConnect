import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import formReducer from "../store/formSlice";
import userLocationReducer from "./userLocation"

const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    userLocation: userLocationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import websitesReducer from "./slices/websitesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    websites: websitesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

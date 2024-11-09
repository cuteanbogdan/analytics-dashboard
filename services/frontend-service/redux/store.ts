import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import websitesReducer from "./slices/websitesSlice";
import websiteDetailsReducer from "./slices/websiteDetailsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    websites: websitesReducer,
    websiteDetails: websiteDetailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import websitesReducer from "@/redux/slices/websitesSlice";
import { RootState } from "@/redux/store";

export const createMockStore = (initialState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      websites: websitesReducer,
    },
    preloadedState: initialState as RootState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type MockStore = ReturnType<typeof createMockStore>;

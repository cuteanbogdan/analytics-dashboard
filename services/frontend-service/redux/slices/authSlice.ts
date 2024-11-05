import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/login`,
        credentials
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue("Failed to login");
    }
  }
);

export const refreshAuthState = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/refresh-token`,
        null,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        dispatch(logoutAsync());
      }
      return rejectWithValue("Failed to refresh token");
    }
  }
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/logout`,
        null,
        {
          withCredentials: true,
        }
      );

      dispatch(resetAuthState());
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loginAsync.fulfilled,
        (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
        }
      )
      .addCase(refreshAuthState.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;

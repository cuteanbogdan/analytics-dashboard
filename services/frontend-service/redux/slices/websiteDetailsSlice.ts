import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "@/apollo/client";
import { AppDispatch } from "../store";
import { handleTokenExpiration } from "../utils";
import { WebsiteState } from "../interfaces/WebsiteDetails";
import {
  GET_WEBSITE_DETAILS,
  GET_PAGE_VIEWS,
  GET_VISITOR_STATS,
  GET_SESSIONS,
} from "../graphql/websiteDetailsQueries";

const initialState: WebsiteState = {
  details: null,
  pageViews: [],
  visitorStats: [],
  sessions: [],
  loading: false,
  error: null,
};

export const fetchWebsiteDetailsAsync = createAsyncThunk(
  "website/fetchDetails",
  async (tracking_id: string, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await handleTokenExpiration(
        () =>
          client.query({
            query: GET_WEBSITE_DETAILS,
            variables: { tracking_id },
          }),
        dispatch as AppDispatch
      );
      return data.getWebsiteByTrackingID;
    } catch (error) {
      return rejectWithValue("Failed to fetch website details");
    }
  }
);

export const fetchPageViewsAsync = createAsyncThunk(
  "website/fetchPageViews",
  async (tracking_id: string, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await handleTokenExpiration(
        () =>
          client.query({ query: GET_PAGE_VIEWS, variables: { tracking_id } }),
        dispatch as AppDispatch
      );
      return data.getPageViews;
    } catch (error) {
      return rejectWithValue("Failed to fetch page views");
    }
  }
);

export const fetchVisitorStatsAsync = createAsyncThunk(
  "website/fetchVisitorStats",
  async (tracking_id: string, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await handleTokenExpiration(
        () =>
          client.query({
            query: GET_VISITOR_STATS,
            variables: { tracking_id },
          }),
        dispatch as AppDispatch
      );
      return data.getVisitorStats;
    } catch (error) {
      return rejectWithValue("Failed to fetch visitor stats");
    }
  }
);

export const fetchSessionsAsync = createAsyncThunk(
  "website/fetchSessions",
  async (tracking_id: string, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await handleTokenExpiration(
        () => client.query({ query: GET_SESSIONS, variables: { tracking_id } }),
        dispatch as AppDispatch
      );
      return data.getPageSessions;
    } catch (error) {
      return rejectWithValue("Failed to fetch sessions");
    }
  }
);

const websiteDetailsSlice = createSlice({
  name: "website",
  initialState,
  reducers: {
    resetWebsiteState: (state) => {
      state.details = null;
      state.pageViews = [];
      state.visitorStats = [];
      state.sessions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebsiteDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebsiteDetailsAsync.fulfilled, (state, action) => {
        state.details = action.payload;
        state.loading = false;
      })
      .addCase(fetchWebsiteDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPageViewsAsync.fulfilled, (state, action) => {
        state.pageViews = action.payload;
      })
      .addCase(fetchVisitorStatsAsync.fulfilled, (state, action) => {
        state.visitorStats = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchSessionsAsync.fulfilled, (state, action) => {
        state.sessions = action.payload;
      });
  },
});

export const { resetWebsiteState } = websiteDetailsSlice.actions;
export default websiteDetailsSlice.reducer;

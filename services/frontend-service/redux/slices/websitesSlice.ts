import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import client from "@/apollo/client";
import { handleTokenExpiration } from "@/redux/utils";
import { AppDispatch } from "../store";
import { Website, WebsitesState } from "../interfaces/Websites";
import { GET_WEBSITES } from "../graphql/websitesQueries";
import { ADD_WEBSITE } from "../graphql/websitesMutations";

const initialState: WebsitesState = {
  websites: [],
  loading: false,
  error: null,
};

export const fetchWebsitesAsync = createAsyncThunk(
  "websites/fetchWebsites",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const query = () => client.query({ query: GET_WEBSITES });
      const { data } = await handleTokenExpiration(
        query,
        dispatch as AppDispatch
      );
      return data.getWebsites;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch websites");
    }
  }
);

export const addWebsiteAsync = createAsyncThunk(
  "websites/addWebsite",
  async (
    website: { site_name: string; site_url: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const mutation = () =>
        client.mutate({
          mutation: ADD_WEBSITE,
          variables: website,
        });
      const { data } = await handleTokenExpiration(
        mutation,
        dispatch as AppDispatch
      );
      return data.addWebsite;
    } catch (error: any) {
      return rejectWithValue("Failed to add website");
    }
  }
);

const websitesSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    resetWebsitesState: (state) => {
      state.websites = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebsitesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWebsitesAsync.fulfilled,
        (state, action: PayloadAction<Website[]>) => {
          state.websites = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchWebsitesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addWebsiteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addWebsiteAsync.fulfilled,
        (state, action: PayloadAction<Website>) => {
          state.websites.push(action.payload);
          state.loading = false;
        }
      )
      .addCase(addWebsiteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetWebsitesState } = websitesSlice.actions;
export default websitesSlice.reducer;

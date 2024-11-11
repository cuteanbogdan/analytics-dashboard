import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import client from "@/apollo/client";
import { handleTokenExpiration } from "@/redux/utils";
import { AppDispatch } from "../store";
import { Website, WebsitesState } from "../interfaces/Websites";
import { GET_WEBSITES } from "../graphql/websitesQueries";
import {
  ADD_WEBSITE,
  EDIT_WEBSITE,
  DELETE_WEBSITE,
} from "../graphql/websitesMutations";

const initialState: WebsitesState = {
  websites: [],
  loading: false,
  error: null,
  filterStatus: "all",
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

export const editWebsiteAsync = createAsyncThunk(
  "websites/editWebsite",
  async (
    website: { id: string; site_name: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const mutation = () =>
        client.mutate({
          mutation: EDIT_WEBSITE,
          variables: website,
        });
      const { data } = await handleTokenExpiration(
        mutation,
        dispatch as AppDispatch
      );
      return data.editWebsite;
    } catch (error: any) {
      return rejectWithValue("Failed to edit website");
    }
  }
);

export const deleteWebsiteAsync = createAsyncThunk(
  "websites/deleteWebsite",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const mutation = () =>
        client.mutate({
          mutation: DELETE_WEBSITE,
          variables: { id },
        });
      await handleTokenExpiration(mutation, dispatch as AppDispatch);
      return id;
    } catch (error: any) {
      return rejectWithValue("Failed to delete website");
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
    setFilterStatus: (
      state,
      action: PayloadAction<"all" | "active" | "inactive">
    ) => {
      state.filterStatus = action.payload;
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
      })

      .addCase(editWebsiteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editWebsiteAsync.fulfilled,
        (state, action: PayloadAction<Website>) => {
          const index = state.websites.findIndex(
            (site) => site.id === action.payload.id
          );
          if (index !== -1) {
            state.websites[index].site_name = action.payload.site_name;
          }
          state.loading = false;
        }
      )
      .addCase(editWebsiteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteWebsiteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteWebsiteAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.websites = state.websites.filter(
            (site) => site.id !== action.payload
          );
          state.loading = false;
        }
      )
      .addCase(deleteWebsiteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetWebsitesState, setFilterStatus } = websitesSlice.actions;
export default websitesSlice.reducer;

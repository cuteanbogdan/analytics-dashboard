import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import client from "@/apollo/client";
import { refreshAuthState } from "./authSlice";
interface Website {
  id: string;
  tracking_id: string;
  site_name: string;
  site_url: string;
  active: boolean;
  created_at: string;
  last_active_date?: string;
}

interface WebsitesState {
  websites: Website[];
  loading: boolean;
  error: string | null;
}

const initialState: WebsitesState = {
  websites: [],
  loading: false,
  error: null,
};

const GET_WEBSITES = gql`
  query GetWebsites {
    getWebsites {
      id
      tracking_id
      site_name
      site_url
      active
      created_at
      last_active_date
    }
  }
`;

const ADD_WEBSITE = gql`
  mutation AddWebsite($site_name: String!, $site_url: String!) {
    addWebsite(site_name: $site_name, site_url: $site_url) {
      id
      site_name
      site_url
    }
  }
`;

export const fetchWebsitesAsync = createAsyncThunk(
  "websites/fetchWebsites",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await client.query({ query: GET_WEBSITES });
      return data.getWebsites;
    } catch (error: any) {
      if (
        error.networkError?.statusCode === 401 &&
        error.networkError.result.message === "Token expired"
      ) {
        const refreshResult = await dispatch(refreshAuthState());
        if (refreshAuthState.fulfilled.match(refreshResult)) {
          const { data } = await client.query({ query: GET_WEBSITES });
          return data.getWebsites;
        } else {
          return rejectWithValue(
            "Failed to fetch websites due to expired token"
          );
        }
      }
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
      const { data } = await client.mutate({
        mutation: ADD_WEBSITE,
        variables: website,
      });

      dispatch(fetchWebsitesAsync());

      return data.addWebsite;
    } catch (error: any) {
      if (
        error.networkError?.statusCode === 401 &&
        error.networkError.result.message === "Token expired"
      ) {
        const refreshResult = await dispatch(refreshAuthState());
        if (refreshAuthState.fulfilled.match(refreshResult)) {
          const { data } = await client.mutate({
            mutation: ADD_WEBSITE,
            variables: website,
          });

          dispatch(fetchWebsitesAsync());

          return data.addWebsite;
        } else {
          return rejectWithValue("Failed to add website due to expired token");
        }
      }
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

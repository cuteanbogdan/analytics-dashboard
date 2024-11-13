import { refreshAuthState } from "./slices/authSlice";
import type { AppDispatch, RootState } from "./store";

export const handleTokenExpiration = async (
  query: () => Promise<any>,
  dispatch: AppDispatch
): Promise<any> => {
  try {
    return await query();
  } catch (error: any) {
    if (
      error.networkError?.statusCode === 401 &&
      error.networkError.result?.message === "Token expired"
    ) {
      const refreshResult = await dispatch(refreshAuthState());
      if (refreshAuthState.fulfilled.match(refreshResult)) {
        return await query();
      } else {
        throw new Error("Failed to refresh token");
      }
    }
    throw error;
  }
};

export const selectFilteredWebsites = (state: RootState) => {
  const { websites, filterStatus } = state.websites;
  if (filterStatus === "active") {
    return websites.filter((site) => site.active);
  } else if (filterStatus === "inactive") {
    return websites.filter((site) => !site.active);
  }
  return websites;
};

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} - ${formattedTime}`;
};

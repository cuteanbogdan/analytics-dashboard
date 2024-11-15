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

type TrendData = {
  [key: string]: any;
};

export const processTrendData = (data: TrendData[], timestampField: string) => {
  const countsByDate = data.reduce((acc: Record<string, number>, item) => {
    const date = new Date(Number(item[timestampField])).toLocaleDateString(
      "en-US"
    );
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(countsByDate)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

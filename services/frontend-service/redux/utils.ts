import { refreshAuthState } from "./slices/authSlice";
import type { AppDispatch } from "./store";

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

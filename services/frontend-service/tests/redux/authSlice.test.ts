import { createMockStore, MockStore } from "../mocks/mockStore";
import {
  loginAsync,
  refreshAuthState,
  logoutAsync,
} from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import * as authService from "@/services/authService";

jest.mock("@/services/authService");

describe("Auth Slice", () => {
  let store: MockStore;

  beforeEach(() => {
    store = createMockStore({
      auth: { isAuthenticated: false, user: null, accessToken: null },
    });
    jest.clearAllMocks();
  });

  it("should dispatch loginAsync and update auth state", async () => {
    (authService.loginService as jest.Mock).mockResolvedValue({
      data: {
        user: { id: "user1", email: "test@mail.com" },
        accessToken: "initial_access_token",
      },
    });

    const loginPayload = { email: "test@mail.com", password: "123456" };
    await store.dispatch(loginAsync(loginPayload));

    const state = store.getState() as RootState;
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.user?.email).toBe("test@mail.com");
    expect(state.auth.accessToken).toBe("initial_access_token");
  });

  it("should not update auth state on failed login", async () => {
    (authService.loginService as jest.Mock).mockRejectedValue(
      new Error("Login failed")
    );

    const loginPayload = { email: "wrong@mail.com", password: "incorrect" };
    await store.dispatch(loginAsync(loginPayload));

    const state = store.getState() as RootState;
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBe(null);
    expect(state.auth.accessToken).toBe(null);
  });

  it("should handle refreshAuthState and update access token to a new value", async () => {
    (authService.loginService as jest.Mock).mockResolvedValue({
      data: {
        user: { id: "user1", email: "test@mail.com" },
        accessToken: "initial_access_token",
      },
    });

    await store.dispatch(
      loginAsync({ email: "test@mail.com", password: "123456" })
    );

    const stateAfterLogin = store.getState() as RootState;
    const initialAccessToken = stateAfterLogin.auth.accessToken;

    (authService.refreshTokenService as jest.Mock).mockResolvedValue({
      data: { accessToken: "new_access_token" },
    });

    await store.dispatch(refreshAuthState());
    const stateAfterRefresh = store.getState() as RootState;
    const refreshedAccessToken = stateAfterRefresh.auth.accessToken;

    expect(stateAfterRefresh.auth.isAuthenticated).toBe(true);
    expect(refreshedAccessToken).not.toBe(null);
    expect(refreshedAccessToken).not.toEqual(initialAccessToken);
  });

  it("should handle token refresh failure and maintain auth state", async () => {
    (authService.loginService as jest.Mock).mockResolvedValue({
      data: {
        user: { id: "user1", email: "test@mail.com" },
        accessToken: "initial_access_token",
      },
    });

    await store.dispatch(
      loginAsync({ email: "test@mail.com", password: "123456" })
    );

    const stateAfterLogin = store.getState() as RootState;
    expect(stateAfterLogin.auth.isAuthenticated).toBe(true);

    (authService.refreshTokenService as jest.Mock).mockRejectedValue({
      response: { status: 401 },
    });

    await store.dispatch(refreshAuthState());

    const stateAfterRefreshFailure = store.getState() as RootState;

    expect(stateAfterRefreshFailure.auth.isAuthenticated).toBe(false);
    expect(stateAfterRefreshFailure.auth.user).toBe(null);
    expect(stateAfterRefreshFailure.auth.accessToken).toBe(null);
  });

  it("should handle logout and clear the auth state", async () => {
    (authService.loginService as jest.Mock).mockResolvedValue({
      data: {
        user: { id: "user1", email: "test@mail.com" },
        accessToken: "initial_access_token",
      },
    });

    await store.dispatch(
      loginAsync({ email: "test@mail.com", password: "123456" })
    );

    (authService.logoutService as jest.Mock).mockResolvedValue({});

    await store.dispatch(logoutAsync());
    const state = store.getState() as RootState;

    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBe(null);
    expect(state.auth.accessToken).toBe(null);
  });

  it("should handle logout without prior login", async () => {
    (authService.logoutService as jest.Mock).mockResolvedValue({});

    await store.dispatch(logoutAsync());
    const state = store.getState() as RootState;

    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBe(null);
    expect(state.auth.accessToken).toBe(null);
  });
});

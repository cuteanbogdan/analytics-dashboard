import axios from "axios";

export const loginService = (credentials: {
  email: string;
  password: string;
}) =>
  axios.post(
    `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/login`,
    credentials,
    {
      withCredentials: true,
    }
  );

export const refreshTokenService = () =>
  axios.post(
    `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/refresh-token`,
    null,
    {
      withCredentials: true,
    }
  );

export const logoutService = () =>
  axios.post(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/logout`, null, {
    withCredentials: true,
  });

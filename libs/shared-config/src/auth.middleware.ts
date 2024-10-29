import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token =
    req.cookies["jwt-token"] || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  axios
    .get(`${process.env.AUTH_SERVICE_URL}/auth/validate-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then((response) => {
      req.user = response.data.user;
      next();
    })
    .catch((error) => {
      console.error("Token validation failed:", error);
      res.sendStatus(403);
    });
};

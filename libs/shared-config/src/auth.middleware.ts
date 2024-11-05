import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    res.sendStatus(401);
    return;
  }

  axios
    .get(`${process.env.AUTH_SERVICE_URL}/auth/validate-token`, {
      headers: {
        Cookie: cookies,
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

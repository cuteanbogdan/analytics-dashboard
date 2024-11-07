import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "./passportConfig";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (user: { id: string; role: string }) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
};

export const generateRefreshToken = (user: { id: string }) => {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const validatePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const verifyToken = (
  token: string,
  type: "access" | "refresh"
): Promise<JwtPayload | string | null> => {
  const secret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded) {
        console.error("Token verification error:", err);
        return resolve(null);
      }
      resolve(decoded);
    });
  });
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, user: JwtPayload | false, info: unknown) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (!user) {
        if (info instanceof TokenExpiredError) {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(403).json({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};

import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  validatePassword,
  verifyToken,
} from "./auth.service";
import { query } from "shared-config/dist/db";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await validatePassword(password, user.password_hash))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    res.cookie("jwt-token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  try {
    const result = await query("SELECT * FROM users WHERE refresh_token = $1", [
      refreshToken,
    ]);
    const user = result.rows[0];

    if (!user) {
      res.sendStatus(403);
      return;
    }

    const decoded = await verifyToken(refreshToken, "refresh");
    if (!decoded) {
      res.sendStatus(403);
      return;
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    res.cookie("jwt-token", newAccessToken, { httpOnly: true, secure: true });
    res.sendStatus(200);
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

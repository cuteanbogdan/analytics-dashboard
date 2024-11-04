import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  validatePassword,
  verifyToken,
} from "./auth.service";
import { query } from "shared-config/dist/db";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await query(
      "SELECT * FROM users.accounts WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user || !(await validatePassword(password, user.password_hash))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await query("UPDATE users.accounts SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    res.cookie("jwt-token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await query(
      "SELECT * FROM users.accounts WHERE email = $1",
      [email]
    );
    if ((existingUser.rowCount ?? 0) > 0) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const passwordHash = await hashPassword(password);

    const result = await query(
      `
      INSERT INTO users.accounts (full_name, email, password_hash)
      VALUES ($1, $2, $3) RETURNING id, role
      `,
      [fullName, email, passwordHash]
    );
    const user = result.rows[0];

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await query("UPDATE users.accounts SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    res.cookie("jwt-token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
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
    const result = await query(
      "SELECT * FROM users.accounts WHERE refresh_token = $1",
      [refreshToken]
    );
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

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("jwt-token", { httpOnly: true, secure: true });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });

    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

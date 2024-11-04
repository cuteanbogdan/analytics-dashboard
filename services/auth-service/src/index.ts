import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { login, logout, refreshToken, register } from "./auth/auth.controller";
import passport from "./auth/passportConfig";
import { authenticateToken } from "./auth/auth.service";
import { checkConnection } from "shared-config/dist/db";

const startServer = async () => {
  try {
    await checkConnection("Auth-Service");

    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(passport.initialize());

    app.use(
      cors({
        origin: process.env.FRONTEND_SERVICE_URL || "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );

    app.post("/auth/login", login);
    app.post("/auth/register", register);
    app.post("/auth/logout", logout);
    app.post("/auth/refresh-token", refreshToken);

    app.get("/auth/validate-token", authenticateToken, (req, res) => {
      res.status(200).json({ user: req.user });
    });

    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`Auth Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();

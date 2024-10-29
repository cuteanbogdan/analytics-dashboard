import express from "express";
import cookieParser from "cookie-parser";
import { login, refreshToken } from "./auth/auth.controller";
import passport from "./auth/passportConfig";
import { authenticateToken } from "./auth/auth.service";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.post("/login", login);
app.post("/auth/refresh-token", refreshToken);
app.get("/auth/validate-token", authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}`);
});

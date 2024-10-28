import express from "express";
import cookieParser from "cookie-parser";
import { login, refreshToken, validateToken } from "./auth/auth.controller";
import passport from "./auth/passportConfig";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.post("/login", login);
app.post("/auth/refresh-token", refreshToken);
app.get("/auth/validate-token", validateToken);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}`);
});

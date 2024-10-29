import express from "express";
import dotenv from "dotenv";
import analyticsRoutes from "./routes/analytics.routes";
import { authenticateToken } from "shared-config/dist/auth.middleware";
dotenv.config();

const app = express();
app.use(express.json());

app.use(authenticateToken);

app.use("/api/analytics", analyticsRoutes);

export default app;

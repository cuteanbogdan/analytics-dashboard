import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5001;
export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

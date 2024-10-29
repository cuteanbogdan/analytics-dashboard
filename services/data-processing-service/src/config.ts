import dotenv from "dotenv";

dotenv.config();

export const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
export const POSTGRES_URL = process.env.POSTGRES_URL || "";
export const QUEUE_NAME = process.env.QUEUE_NAME || "tracking_data_queue";
export const IP_API_TOKEN = process.env.IP_API_TOKEN || "";

import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
});

export const checkConnection = async (serviceName: string) => {
  try {
    await pool.connect();
    console.log(`[${serviceName}] DB connected successfully`);
  } catch (error) {
    console.error(`[${serviceName}] DB connection error:`, error);
    process.exit(1);
  }
};

export const query = (text: string, params?: any[]) => pool.query(text, params);

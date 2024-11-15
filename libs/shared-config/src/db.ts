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

export const checkConnection = async (
  serviceName: string,
  retries = 5,
  delay = 5000
): Promise<void> => {
  while (retries > 0) {
    try {
      await pool.connect();
      console.log(`[${serviceName}] DB connected successfully`);
      return;
    } catch (error) {
      console.error(
        `[${serviceName}] DB connection error. Retrying in ${
          delay / 1000
        } seconds...`,
        error
      );
      retries -= 1;
      if (retries === 0) {
        throw new Error(
          `[${serviceName}] Could not connect to DB after multiple attempts`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const query = (text: string, params?: any[]) => pool.query(text, params);

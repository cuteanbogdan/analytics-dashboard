import { Pool } from "pg";
import { POSTGRES_URL } from "./config";

const pool = new Pool({
  connectionString: POSTGRES_URL,
});

export const checkConnection = async () => {
  try {
    await pool.connect();
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

checkConnection();

export const query = (text: string, params?: any[]) => pool.query(text, params);

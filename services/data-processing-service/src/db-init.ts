import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { POSTGRES_URL } from "./config";

const pool = new Pool({ connectionString: POSTGRES_URL });

const runMigrations = async () => {
  const filePath = path.join(
    __dirname,
    "../db/01_create_tracking_data_table.sql"
  );
  const sql = fs.readFileSync(filePath, "utf8");

  try {
    await pool.query(sql);
    console.log("Tracking data table created successfully");
  } catch (error) {
    console.error("Error creating tracking data table:", error);
  } finally {
    await pool.end();
  }
};

runMigrations();

import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT),
  // connectionLimit: 10,
  // charset: 'utf8mb4',
});

export const db = drizzle(pool, { logger: process.env.NODE_ENV === "development" });
export { pool };

export * from "./schema"

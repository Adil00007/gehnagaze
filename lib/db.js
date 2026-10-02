import "server-only";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
const databaseConfig = databaseUrl || {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  ssl: process.env.MYSQL_SSL === "true" ? {} : undefined,
};

export const isDatabaseConfigured = Boolean(
  databaseUrl ||
    (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)
);

const globalForDb = globalThis;
export const db = isDatabaseConfigured
  ? globalForDb.__gehnagazeDb || mysql.createPool(databaseConfig)
  : null;

if (isDatabaseConfigured) globalForDb.__gehnagazeDb = db;

export async function query(sql, values = []) {
  if (!db) throw new Error("Database not configured");
  return db.execute(sql, values);
}

export function parseJson(value, fallback = []) {
  if (Array.isArray(value) || (value && typeof value === "object")) return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
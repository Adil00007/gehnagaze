import "server-only";

import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(databaseUrl);

const globalForDb = globalThis;

export const db = isDatabaseConfigured
  ? globalForDb.__gehnagazeDb ||
    new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      max: 10,
    })
  : null;

if (isDatabaseConfigured) {
  globalForDb.__gehnagazeDb = db;
}

export async function query(sql, values = []) {
  if (!db) throw new Error("Database not configured");

  const result = await db.query(sql, values);

  return [result.rows, result];
}

export function parseJson(value, fallback = []) {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
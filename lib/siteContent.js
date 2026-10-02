import { isDatabaseConfigured, query } from "@/lib/db";

export async function getSiteContent() {
  if (!isDatabaseConfigured) return {};
  try {
    const [rows] = await query("SELECT setting_key, setting_value FROM site_settings");
    return Object.fromEntries(rows.map((row) => [row.setting_key, row.setting_value]));
  } catch {
    return {};
  }
}

export async function getCategories() {
  if (!isDatabaseConfigured) return [];
  try {
    const [categories] = await query("SELECT * FROM categories ORDER BY created_at DESC");
    return categories;
  } catch {
    return [];
  }
}
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, query } from "@/lib/db";

const keys = ["logo_url", "banner_url", "banner_title", "banner_subtitle"];

async function requireAdmin() {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  try {
    const [rows] = await query("SELECT setting_key, setting_value FROM site_settings");
    return NextResponse.json({ settings: Object.fromEntries(rows.map((row) => [row.setting_key, row.setting_value])) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  const body = await req.json();
  try {
    for (const key of keys) {
      if (Object.hasOwn(body, key)) {
        await query("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)", [key, String(body[key] || "")]);
      }
    }
    const [rows] = await query("SELECT setting_key, setting_value FROM site_settings");
    return NextResponse.json({ settings: Object.fromEntries(rows.map((row) => [row.setting_key, row.setting_value])) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
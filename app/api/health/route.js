import { NextResponse } from "next/server";
import { isDatabaseConfigured, query } from "@/lib/db";

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json(
      { ok: false, database: "not_configured" },
      { status: 503 }
    );
  }

  try {
    await query("SELECT 1");
    const [tables] = await query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = DATABASE()
         AND table_name IN ('products', 'discounts', 'orders', 'uploads', 'categories', 'site_settings')`
    );
    const configuredTables = new Set(tables.map((table) => table.TABLE_NAME || table.table_name));
    const requiredTables = ["products", "discounts", "orders", "uploads", "categories", "site_settings"];
    const missingTables = requiredTables.filter((table) => !configuredTables.has(table));
    if (missingTables.length) {
      return NextResponse.json({ ok: false, database: "schema_incomplete", missingTables }, { status: 503 });
    }
    return NextResponse.json({ ok: true, database: "connected" });
  } catch (error) {
    return NextResponse.json({ ok: false, database: "unavailable", error: error.message }, { status: 503 });
  }
}
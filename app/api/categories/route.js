import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, query } from "@/lib/db";

async function requireAdmin() {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  try {
    const [categories] = await query("SELECT * FROM categories ORDER BY created_at DESC");
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  const body = await req.json();
  if (!body.name?.trim()) return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  try {
    const id = randomUUID();
    await query("INSERT INTO categories (id, name, image_url) VALUES (?, ?, ?)", [id, body.name.trim(), body.image_url || ""]);
    const [categories] = await query("SELECT * FROM categories WHERE id = ?", [id]);
    return NextResponse.json({ category: categories[0] });
  } catch (error) {
    return NextResponse.json({ error: error.code === "ER_DUP_ENTRY" ? "That category already exists" : error.message }, { status: 500 });
  }
}
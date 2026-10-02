import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, query } from "@/lib/db";

async function requireAdmin() {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}

export async function PUT(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  const { id } = await params;
  const body = await req.json();
  const updates = ["name", "image_url"].filter((field) => Object.hasOwn(body, field));
  if (!updates.length) return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  try {
    await query(`UPDATE categories SET ${updates.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`, [...updates.map((field) => body[field]), id]);
    const [categories] = await query("SELECT * FROM categories WHERE id = ?", [id]);
    if (!categories[0]) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({ category: categories[0] });
  } catch (error) {
    return NextResponse.json({ error: error.code === "ER_DUP_ENTRY" ? "That category already exists" : error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  try {
    await query("DELETE FROM categories WHERE id = ?", [(await params).id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
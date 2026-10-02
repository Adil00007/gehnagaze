import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, query } from "@/lib/db";

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export async function GET(req, { params }) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  const { id } = await params;
  try {
    const [products] = await query("SELECT * FROM products WHERE id = ?", [id]);
    if (!products[0]) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product: products[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  const { id } = await params;
  const body = await req.json();
  const fields = ["name", "description", "price", "discounted_price", "image_url", "category", "in_stock"];
  const updates = fields.filter((field) => Object.hasOwn(body, field));
  if (!updates.length) return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  try {
    await query(
      `UPDATE products SET ${updates.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`,
      [...updates.map((field) => body[field]), id]
    );
    const [products] = await query("SELECT * FROM products WHERE id = ?", [id]);
    if (!products[0]) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product: products[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  const { id } = await params;
  try {
    await query("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, query } from "@/lib/db";

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
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
  const fields = ["title", "description", "percentage", "active"];
  const updates = fields.filter((field) => Object.hasOwn(body, field));
  if (!updates.length) return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  try {
    if (body.active) await query("UPDATE discounts SET active = FALSE WHERE active = TRUE");
    await query(
      `UPDATE discounts SET ${updates.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`,
      [...updates.map((field) => body[field]), id]
    );
    const [discounts] = await query("SELECT * FROM discounts WHERE id = ?", [id]);
    if (!discounts[0]) return NextResponse.json({ error: "Discount not found" }, { status: 404 });
    return NextResponse.json({ discount: discounts[0] });
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
    await query("DELETE FROM discounts WHERE id = ?", [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

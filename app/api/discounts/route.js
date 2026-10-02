import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, query } from "@/lib/db";

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  try {
    const [discounts] = await query("SELECT * FROM discounts ORDER BY created_at DESC");
    return NextResponse.json({ discounts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  const body = await req.json();
  const { title, description, percentage, active } = body;
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  try {
    if (active) await query("UPDATE discounts SET active = FALSE WHERE active = TRUE");
    const id = randomUUID();
    await query(
      `INSERT INTO discounts (id, title, description, percentage, active)
       VALUES (?, ?, ?, ?, ?)`,
      [id, title, description || "", percentage || null, active ?? false]
    );
    const [discounts] = await query("SELECT * FROM discounts WHERE id = ?", [id]);
    return NextResponse.json({ discount: discounts[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

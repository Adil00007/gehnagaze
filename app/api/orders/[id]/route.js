import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, parseJson, query } from "@/lib/db";

export async function PUT(req, { params }) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  const { id } = await params;
  const body = await req.json();
  const statuses = ["pending", "confirmed", "shipped", "cancelled"];
  if (!statuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }
  try {
    await query("UPDATE orders SET status = ? WHERE id = ?", [body.status, id]);
    const [orders] = await query("SELECT * FROM orders WHERE id = ?", [id]);
    if (!orders[0]) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order: { ...orders[0], items: parseJson(orders[0].items) } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

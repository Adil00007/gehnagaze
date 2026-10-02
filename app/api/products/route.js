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
    const [products] = await query("SELECT * FROM products ORDER BY created_at DESC");
    return NextResponse.json({ products });
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
  const { name, description, price, discounted_price, image_url, category, in_stock } = body;

  if (!name || !price) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  try {
    const id = randomUUID();
    await query(
      `INSERT INTO products
        (id, name, description, price, discounted_price, image_url, category, in_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description || "", price, discounted_price || null, image_url || "", category || "", in_stock ?? true]
    );
    const [products] = await query("SELECT * FROM products WHERE id = ?", [id]);
    return NextResponse.json({ product: products[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

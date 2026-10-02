import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, parseJson, query } from "@/lib/db";

export async function GET() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  try {
    const [orders] = await query("SELECT * FROM orders ORDER BY created_at DESC");
    return NextResponse.json({ orders: orders.map((order) => ({ ...order, items: parseJson(order.items) })) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
  const body = await req.json();
  const { customer_name, phone, address, payment_method, transaction_id, notes, items } = body;

  if (!customer_name || !phone || !address || !items?.length) {
    return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
  }
  if (!["bank", "jazzcash"].includes(payment_method)) {
    return NextResponse.json({ error: "Select a valid payment method" }, { status: 400 });
  }

  try {
    const productIds = [...new Set(items.map((item) => item.id))];
    if (productIds.some((id) => typeof id !== "string")) {
      return NextResponse.json({ error: "Invalid order items" }, { status: 400 });
    }
    const placeholders = productIds.map(() => "?").join(", ");
    const [products] = await query(
      `SELECT id, name, price, discounted_price, in_stock FROM products WHERE id IN (${placeholders})`,
      productIds
    );
    const productMap = new Map(products.map((product) => [product.id, product]));
    const orderItems = [];
    let total = 0;
    for (const item of items) {
      const product = productMap.get(item.id);
      const qty = Number(item.qty);
      if (!product || !product.in_stock || !Number.isInteger(qty) || qty < 1 || qty > 99) {
        return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
      }
      const price = Number(product.discounted_price ?? product.price);
      orderItems.push({ id: product.id, name: product.name, price, qty });
      total += price * qty;
    }

    const id = randomUUID();
    await query(
      `INSERT INTO orders
        (id, customer_name, phone, address, payment_method, transaction_id, notes, items, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [id, customer_name, phone, address, payment_method || "", transaction_id || "", notes || "", JSON.stringify(orderItems), total]
    );
    const [orders] = await query("SELECT * FROM orders WHERE id = ?", [id]);
    return NextResponse.json({ order: { ...orders[0], items: parseJson(orders[0].items) } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

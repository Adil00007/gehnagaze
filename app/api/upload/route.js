import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";
import { isDatabaseConfigured, query } from "@/lib/db";

export async function POST(req) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Images must be smaller than 10 MB" }, { status: 400 });
  }

  try {
    const id = randomUUID();
    await query(
      "INSERT INTO uploads (id, filename, mime_type, data) VALUES (?, ?, ?, ?)",
      [id, file.name.slice(0, 255), file.type, Buffer.from(await file.arrayBuffer())]
    );
    return NextResponse.json({ url: `/api/uploads/${id}` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

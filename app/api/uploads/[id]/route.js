import { NextResponse } from "next/server";
import { isDatabaseConfigured, query } from "@/lib/db";

export async function GET(req, { params }) {
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  const { id } = await params;
  try {
    const [uploads] = await query("SELECT mime_type, data FROM uploads WHERE id = ?", [id]);
    if (!uploads[0]) return NextResponse.json({ error: "Image not found" }, { status: 404 });
    return new NextResponse(uploads[0].data, {
      headers: {
        "Content-Type": uploads[0].mime_type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
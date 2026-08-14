import { NextResponse } from "next/server";
import { getDb } from "../../../db";

export const runtime = "nodejs";

export function GET() {
  try {
    getDb().prepare("SELECT 1").get();
    return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}

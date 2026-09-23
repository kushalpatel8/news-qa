import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken) {
      console.warn("ADMIN_TOKEN is not set in environment variables");
      return NextResponse.json({ valid: false, error: "Server misconfiguration" }, { status: 500 });
    }

    if (token === adminToken) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false, error: "Invalid admin token" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Validation failed" }, { status: 500 });
  }
}

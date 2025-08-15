import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const isEnabled = process.env.PROMO_CODE_ENABLED === "true"; // Fetch from env or DB
    return NextResponse.json({ enabled: isEnabled });
  } catch (error) {
    console.error("Error fetching promo code status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { enabled } = await req.json();
    // Update environment variable (temporary; replace with DB update in production)
    process.env.PROMO_CODE_ENABLED = enabled ? "true" : "false";
    return NextResponse.json({ enabled });
  } catch (error) {
    console.error("Error updating promo code status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: Request) {
  return NextResponse.json({}, { status: 200 });
}

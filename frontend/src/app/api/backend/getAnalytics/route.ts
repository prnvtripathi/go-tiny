import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const session = await auth();

  const { url_id } = body;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/getanalytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url_id, user_id: session?.user?.userid }),
    });

    const data = await response.json();

    return NextResponse.json({ data, success: data?.success });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to get analytics",
    });
  }
}

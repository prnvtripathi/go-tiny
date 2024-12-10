import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const session = await auth();
  const { url, url_id, short_code, size, error_correction } = body;

  if (!url || !url_id || !short_code) {
    return NextResponse.json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/generateqr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        url_id,
        short_code,
        size,
        error_correction,
        created_by: session?.user?.userid,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ success: false, message: error.message });
    }

    // console.log(response);

    const data = await response.json();

    // console.log(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to generate QR",
    });
  }
}

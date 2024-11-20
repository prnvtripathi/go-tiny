import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = async () => {
  const session = await auth();
  const response = await fetch(`${process.env.BACKEND_URL}/getqrs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: Number(session?.user?.userid),
    }),
  });

  const data = await response.json();

  const { qrs } = data;
  const updatedQrs = qrs.map((qr: Qr) => {
    return {
      ...qr,
      short_code: `${process.env.BACKEND_URL}/r/${qr.short_code}`,
    };
  });

  return NextResponse.json({ qrs: updatedQrs });
};

type Qr = {
  url_id: number;
  user_id: number;
  url: string;
  name: string;
  click_count: number;
  short_code: string;
  created_at: string;
};

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = async () => {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/getUrls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: Number(session?.user?.userid),
      }),
    });

    const data = await response.json();

    const { urls } = data;
    const updatedUrls = urls.map((url: Url) => {
      return {
        ...url,
        short_code: `${process.env.BACKEND_URL}/r/${url.short_code}`,
      };
    });
    console.log(updatedUrls);
    console.log(data);
    return NextResponse.json({ urls: updatedUrls });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ urls: [], message: "Failed to get URLs" });
  }
};

type Url = {
  url_id: number;
  user_id: number;
  url: string;
  name: string;
  click_count: number;
  short_code: string;
  created_at: string;
};

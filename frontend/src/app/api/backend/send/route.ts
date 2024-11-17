import { NextResponse } from "next/server"
import { auth } from "@/auth"

export const POST = async (req: Request) => {
    const body = await req.json()

    const session = await auth()

    const { url, name, code, expiryDate, isCustom } = body
    const response = await fetch(`${process.env.BACKEND_URL}/shorten`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url,
            name,
            custom_code: code.shortCode,
            custom_code_enabled: code.isCustomCode,
            expires_at: expiryDate,
            custom_expiry: isCustom,
            created_by: session?.user?.userid,
        })
    })

    const data = await response.json()
    return NextResponse.json(data)
}

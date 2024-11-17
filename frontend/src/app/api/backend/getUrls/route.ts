import { NextResponse } from "next/server"
import { auth } from "@/auth"

export const GET = async () => {

    const session = await auth()
    const response = await fetch(`${process.env.BACKEND_URL}/getUrls`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "user_id": Number(session?.user?.userid),
        })
    })

    const data = await response.json()

    const { urls } = data
    const updatedUrls = urls.map((url: Url) => {
        return {
            ...url,
            short_code: `${process.env.BACKEND_URL}/r/${url.short_code}`
        }
    })
    return NextResponse.json({ urls: updatedUrls })
}

type Url = {
    url_id: number
    user_id: number
    url: string
    name: string
    short_code: string
    created_at: string
}
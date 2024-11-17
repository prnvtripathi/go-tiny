import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function DELETE(request: Request) {
    try {
        const { url_id } = await request.json();
        const session = await auth();

        if (!session?.user?.userid) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${process.env.BACKEND_URL}/deleteUrl`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url_id: Number(url_id), user_id: Number(session?.user?.userid) }),
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ message: errorData.message || 'Failed to delete URL' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in DELETE handler:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
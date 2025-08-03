// /src/app/api/validate-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import SessionManager from '@/lib/designPatterns/singleton/Session-manager';

export async function POST(req: NextRequest) {
    try {
        const { sessionToken, userId } = await req.json();

        const sessionManager = SessionManager.getInstance();
        const isValid = await sessionManager.validateSession(sessionToken, userId);

        return NextResponse.json({ isValid });
    } catch (err) {
        console.error("Session validation error:", err);
        return NextResponse.json({ isValid: false }, { status: 500 });
    }
}

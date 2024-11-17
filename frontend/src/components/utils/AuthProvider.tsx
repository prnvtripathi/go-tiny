"use client";

import { Session } from "next-auth";
import { SessionProvider as AuthProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProps {
    children: ReactNode;
    session: Session | null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
    return <AuthProvider session={session}>{children}</AuthProvider>;
}
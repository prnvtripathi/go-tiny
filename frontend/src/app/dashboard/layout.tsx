"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="md:flex-1">
                <SidebarTrigger className="fixed left-2 bottom-2 flex md:hidden" />
                {children}
            </main>
        </SidebarProvider>
    )
}
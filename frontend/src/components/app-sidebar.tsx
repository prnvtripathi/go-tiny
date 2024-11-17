"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar
} from "@/components/ui/sidebar"
import { LayoutDashboard, BarChart2, Settings, LogOut, ChevronsLeft } from 'lucide-react'
import Image from 'next/image'
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

export function AppSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const { toggleSidebar } = useSidebar()
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link href="/" className='flex items-center gap-2 flex-row py-3 w-fit'>
                    <Image src="/images/logo.svg" alt='Logo' height={32} width={32} priority />
                    {isSidebarOpen &&
                        <AnimatePresence>
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-bold"
                            >
                                GoTiny
                            </motion.span>
                        </AnimatePresence>
                    }
                </Link>
            </SidebarHeader>
            <SidebarContent className='pl-2'>
                <SidebarMenu>
                    <SidebarMenuItem className="pr-2">
                        <SidebarMenuButton
                            tooltip="Dashboard"
                            isActive={pathname.includes("/dashboard/home")}
                            asChild
                            className="flex items-center"
                        >
                            <Link href="/dashboard/home">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="pr-2">
                        <SidebarMenuButton
                            tooltip="Analytics"
                            isActive={pathname.includes("/dashboard/analytics")}
                            asChild
                            className="flex items-center"
                        >
                            <Link href="/dashboard/analytics">
                                <BarChart2 className="h-4 w-4" />
                                <span>Analytics</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="pr-2">
                        <SidebarMenuButton
                            tooltip="Settings"
                            isActive={pathname.includes("/dashboard/settings")}
                            asChild
                            className="flex items-center"
                        >
                            <Link href="/dashboard/settings">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Sidebar"
                            onClick={() => {
                                toggleSidebar()
                                setIsSidebarOpen(!isSidebarOpen)
                            }}
                            className="flex items-center justify-center w-fit"
                        >
                            <ChevronsLeft className={`h-6 w-6 ${isSidebarOpen ? "" : "transform rotate-180"} transition-transform duration-300`} />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Logout"
                            onClick={() => {
                                signOut({ redirect: true, redirectTo: "/login" })
                            }}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

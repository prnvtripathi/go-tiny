"use client";

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from '@/components/ui/sheet';
import { navItems } from "@/data/navItems";
import { CgMenuRight } from "react-icons/cg";
import Link from "next/link";
import Logo from './logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { BiSolidDoorOpen } from "react-icons/bi";
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from './theme-toggle';

export default function MobileNav() {
    const { data: session } = useSession()
    const user = session?.user;
    return (
        <nav className="flex md:hidden items-center justify-between px-4 py-2 z-20 relative">
            <Logo />
            <Sheet>
                <SheetTrigger asChild>
                    <CgMenuRight size={24} />
                </SheetTrigger>
                <SheetContent side="right" className="dark:bg-black dark:text-white">
                    <SheetHeader>
                        <SheetTitle className="text-white mb-4">GoTiny</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col items-start gap-y-5">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex gap-x-2">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className='flex flex-row gap-3 items-center cursor-pointer '>
                                            <Avatar className="size-9">
                                                <AvatarImage src={user.image || "/noavatar.png"} />
                                                <AvatarFallback>{user?.name?.at(0)?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="ml-2">{user?.name || user?.email}</span>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center">
                                        <DropdownMenuLabel>Hi, {user?.name || user?.email}</DropdownMenuLabel>

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Button className='' variant='outline' onClick={() => signOut({ redirect: true, redirectTo: "/login" })}>
                                                <BiSolidDoorOpen size={20} />
                                                <span className="ml-2">Logout</span>
                                            </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex gap-3 items-center">
                                    <Button variant="outline" className="font-sans w-full" asChild>
                                        <Link href={"/login"}>
                                            Login
                                        </Link>
                                    </Button>
                                    <Button variant="secondary" className="font-sans w-full" asChild>
                                        <Link href={"/register"}>
                                            Register
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <SheetFooter className='absolute bottom-4'>
                        <ThemeToggle />
                    </SheetFooter>
                </SheetContent >
            </Sheet>


        </nav>
    )
}
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import { BiSolidDoorOpen } from "react-icons/bi";
import { navItems } from "@/data/navItems";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";


export default async function DesktopNav() {
    const session = await auth();
    const user = session?.user;

    return (
        <nav className="md:flex justify-between items-center py-3 px-12 hidden bg-black backdrop-blur-md bg-opacity-10 z-20 relative">
            <Logo />
            <ul className="flex items-center gap-3">
                {navItems.map((item) => (
                    <Button key={item.id} asChild className="bg-transparent" variant="ghost">
                        <li>
                            <Link href={item.link} className="flex items-center gap-x-2">
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    </Button>
                ))}
                <li className="mr-2">
                    <ThemeToggle />
                </li>
                <li className="flex gap-x-2">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer size-9">
                                    <AvatarImage src={user.image || "/noavatar.png"} />
                                    <AvatarFallback>{user?.name?.at(0)?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hi, {user?.name || user?.email}</DropdownMenuLabel>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <form className="w-full"
                                        action={async () => {
                                            "use server";
                                            await signOut({
                                                redirectTo: "/login",
                                                redirect: true,
                                            });
                                        }}
                                    >
                                        <button className="w-full text-red-500 flex items-center gap-2 font-bold"><BiSolidDoorOpen size={20} />Logout</button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="font-sans" asChild>
                                <Link href={"/login"}>
                                    Login
                                </Link>
                            </Button>
                            <Button variant="secondary" className="font-sans" asChild>
                                <Link href={"/register"}>
                                    Register
                                </Link>
                            </Button>
                        </div>
                    )}
                </li>
            </ul>

        </nav>
    )
}
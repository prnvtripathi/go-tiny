import MobileNav from "@/components/ui/mobile-navbar";
import DesktopNav from "@/components/ui/desktop-navbar";

export default async function Navbar() {
    return (
        <>
            <DesktopNav />
            <MobileNav />
        </>
    );
}

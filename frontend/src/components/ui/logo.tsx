import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            <Image src='/images/logo.svg' width={32} height={32} alt="Logo" />
            <h2 className="text-2xl font-bold text-black dark:text-white font-sans">
                GoTiny
            </h2>
        </div>
    );
}
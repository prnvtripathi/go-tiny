import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/utils/AuthProvider";
import { auth } from "@/auth";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Go Tiny",
  description: "URL Shortener",
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={``}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

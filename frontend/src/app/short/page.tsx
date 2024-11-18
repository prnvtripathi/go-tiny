import UrlShortenerStepForm from "@/components/url-shortener-step-form";
import Navbar from "@/components/navbar";
import { auth } from "@/auth";
import AuthForm from "@/components/auth-form";
import Link from "next/link";

export default async function UrlShortenerPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="h-screen flex justify-center items-center flex-col">
        <AuthForm variant="login" />
        <span className="text-neutral-400 text-center block mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-white underline underline-offset-2"
          >
            Register
          </Link>
        </span>
      </main>
    );
  }
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto">
        <UrlShortenerStepForm />
      </main>
    </>
  );
}

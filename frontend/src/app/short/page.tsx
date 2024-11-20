import Navbar from "@/components/navbar";
import UrlShortenerForm from "@/components/url-shortener-form";

export default async function UrlShortenerPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto">
        <UrlShortenerForm />
      </main>
    </>
  );
}

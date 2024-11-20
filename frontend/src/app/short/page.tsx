import UrlShortenerStepForm from "@/components/url-shortener-step-form";
import Navbar from "@/components/navbar";

export default async function UrlShortenerPage() {

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto">
        <UrlShortenerStepForm />
      </main>
    </>
  );
}

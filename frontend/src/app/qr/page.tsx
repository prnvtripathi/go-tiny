import Navbar from "@/components/navbar";
import QRCodeForm from "@/components/qr-code-form";

export default async function UrlShortenerPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto">
        <QRCodeForm />
      </main>
    </>
  );
}

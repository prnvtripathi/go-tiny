import { Characteristics } from "@/components/characteristics";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Separator />
        <Features />
        <Separator />
        <Characteristics />
      </main>
      <Footer />
    </>
  );
}

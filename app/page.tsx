import { LandingShell } from "@/components/Landing/LandingShell";
import { Navbar } from "@/components/Landing/Navbar";
import { Hero } from "@/components/Landing/Hero";
import { Features } from "@/components/Landing/Features";
import { HowItWorks } from "@/components/Landing/HowItWorks";
import { LiveDemo } from "@/components/Landing/LiveDemo";
import { Cta, Faq, Footer } from "@/components/Landing/Closing";

export default function LandingPage() {
  return (
    <LandingShell>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <LiveDemo />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </LandingShell>
  );
}

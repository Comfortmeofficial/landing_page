import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { PainPoint } from '@/components/sections/PainPoint';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Rental } from '@/components/sections/Rental';
import { Contact } from '@/components/sections/Contact';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';

export function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <PainPoint />
      <HowItWorks />
      <Rental />
      <Contact />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}

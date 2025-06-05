import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { IdeIntegrationSection } from '@/components/sections/IdeIntegrationSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
import { AiToolsSection } from '@/components/sections/AiToolsSection';
import { CtaSection } from '@/components/sections/CtaSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <IdeIntegrationSection />
        <TestimonialSection />
        <AiToolsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

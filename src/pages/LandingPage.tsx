import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CollaborationSection } from '@/components/landing/CollaborationSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { useScroll } from 'framer-motion';
import { HeroCanvas } from '@/components/landing/HeroCanvas';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-transparent">
      <HeroCanvas scrollYProgress={scrollYProgress} />
      <Navbar />
      <main>
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>

        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

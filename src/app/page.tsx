import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import DeveloperSection from '@/components/DeveloperSection/DeveloperSection';
import Pricing from '@/components/Pricing/Pricing';
import Footer from '@/components/Footer/Footer';
import Reveal from '@/components/Reveal/Reveal';
import './page.css';

export default function Home() {
  return (
    <main className="main-layout">
      <Header />
      <Hero />
      
      <section className="features-section" id="models">
        <div className="container">
          <div className="section-header">
            <Reveal width="100%" direction="up" distance={30}>
              <h2 className="section-title">One API. <span className="gradient-text">Infinite Possibilities.</span></h2>
            </Reveal>
            <Reveal width="100%" direction="up" distance={20} delay={0.3}>
              <p className="section-subtitle">Choose from a curated catalog of world-class AI models specifically optimized for production.</p>
            </Reveal>
          </div>
          <FeatureCards />
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal width="100%" direction="right" distance={40}>
            <h2 className="section-title">Developers <span className="gradient-text">First</span></h2>
          </Reveal>
          <Reveal width="100%" direction="right" distance={30} delay={0.3}>
            <p className="section-subtitle">Integrate into your codebase in minutes, not weeks.</p>
          </Reveal>
          <Reveal width="100%" direction="up" distance={50} delay={0.5}>
            <DeveloperSection />
          </Reveal>
        </div>
      </section>

      <Pricing />

      <Footer />
    </main>
  );
}


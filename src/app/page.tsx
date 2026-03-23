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
      
      <Reveal width="100%">
        <section className="features-section" id="models">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">One API. <span className="gradient-text">Infinite Possibilities.</span></h2>
              <p className="section-subtitle">Choose from a curated catalog of world-class AI models specifically optimized for production.</p>
            </div>
            <FeatureCards />
          </div>
        </section>
      </Reveal>

      <Reveal width="100%">
        <section className="section section-dark">
          <div className="container">
            <h2 className="section-title">Developers <span className="gradient-text">First</span></h2>
            <p className="section-subtitle">Integrate into your codebase in minutes, not weeks.</p>
            <DeveloperSection />
          </div>
        </section>
      </Reveal>

      <Reveal width="100%">
        <section id="pricing" className="section">
          <div className="container">
            <h2 className="section-title">Simple <span className="gradient-text">Pricing</span></h2>
            <p className="section-subtitle">Flexible plans designed to grow with your application's needs.</p>
            <Pricing />
          </div>
        </section>
      </Reveal>

      <Footer />
    </main>
  );
}

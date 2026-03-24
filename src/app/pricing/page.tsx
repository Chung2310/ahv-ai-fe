'use client';

import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Pricing from '@/components/Pricing/Pricing';
import ModelPricing from '@/components/Pricing/ModelPricing';
import ServiceMethods from '@/components/Pricing/ServiceMethods';
import Reveal from '@/components/Reveal/Reveal';

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      
      {/* Hero / Main Tiers Section */}
      <Pricing />

      {/* API Service Methods Section */}
      <ServiceMethods />

      {/* Detailed Model Pricing Section */}
      <ModelPricing />

      {/* FAQ or Call to Action could go here */}
      <section className="section bg-surface-dark">
        <div className="container text-center">
            <Reveal width="100%" direction="up">
                <h2 className="section-title">Ready to <span className="gradient-text">Power Up?</span></h2>
                <p className="section-subtitle">Join thousands of developers building with AHV AI.</p>
                <div className="flex-center gap-20 mt-40">
                    <button className="btn-primary skew-btn"><span>Get Started for Free</span></button>
                    <button className="btn-secondary">Contact Sales</button>
                </div>
            </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

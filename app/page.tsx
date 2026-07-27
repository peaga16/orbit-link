import Link from 'next/link';
import { SignUpButton } from '@clerk/nextjs';
import { TemplateShowcase } from '@/components/landing/template-showcase';
import { PricingPlans } from '@/components/landing/pricing-plans';
import { ClientCaseStudies } from '@/components/landing/client-cases';
import { FeatureGrid } from '@/components/landing/feature-grid';
import { CTASection } from '@/components/landing/cta-section';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';

export default function Home() {
  return (
    <div className="bg-white overflow-hidden">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <ClientCaseStudies />
      <TemplateShowcase />
      <PricingPlans />
      <CTASection />
    </div>
  );
}

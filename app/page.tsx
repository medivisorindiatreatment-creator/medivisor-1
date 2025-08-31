'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import TreatmentServices from '@/components/TreatmentServices';
import About from '@/components/About';
import SocialActivity from '@/components/socialActivity';
import OurInitiativesSection from '@/components/OurInitiativesSection';
import Testimonials from '@/components/Testimonials';
import MediaCoverage from "@/components/mediaCovrage"
import ProcessSteps from '@/components/ProcessSteps';
import BlogSection from '@/components/BlogSection';
import PaitentSupport from '@/components/paitentSupport';
import SupportTrustSection from '@/components/supportTrustSection';
import PartnerSection from '@/components/PartnerSection';
import ExtentCare from '@/components/extentCare';
import ContactModal from '@/components/ContactModal';
import Overview from '@/components/Overview';
import Activities from '@/components/Activities';
import CtaSection from '@/components/CtaSection';
import HumanBody from "@/components/humanBody"
import MediaCoveragePage from './media-coverage/page';
import DidYouKnowSection from '@/components/DidYouKnow';
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Handle modal open buttons
    const handleModalOpen = () => setIsModalOpen(true);

    const modalButtons = document.querySelectorAll('.modal-open-btn');
    modalButtons.forEach(button => {
      button.addEventListener('click', handleModalOpen);
    });

    return () => {
      modalButtons.forEach(button => {
        button.removeEventListener('click', handleModalOpen);
      });
    };
  }, []);
  // Mock data - replace with your actual data source

  return (
    <div className="bg-white min-h-screen">
      <main>
        <Hero />
        <Partners />
        <DidYouKnowSection />
        <BlogSection />
        <TreatmentServices />

        <Testimonials />
        <PaitentSupport />
        <Activities />


        {/* <SocialActivity/> */}
        <ExtentCare />
        {/* <OurInitiativesSection /> */}
        <MediaCoverage />
        {/* <Services /> */}

        {/* <ExtentCare/> */}
        {/* <HumanBody/> */}






        <PartnerSection />

        <CtaSection />
      </main>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { GiKidneys, GiStomach } from "react-icons/gi";
import { Button } from '@/components/ui/button';
import Slider from "react-slick"; // carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  FaHeart,
  FaLungs,
  FaPlusCircle,
  FaHeartbeat,
  FaRibbon,
  FaBrain,
  FaXRay,
  FaSyringe,
  FaAllergies,
  FaJoint,
  FaEye,
  FaBaby,
  FaWeight,
  FaHandHoldingMedical,
  FaVenusMars,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';

import Banner from '@/components/BannerService';
import ProcessSteps from '@/components/ProcessSteps';
import SafetyMeasures from '@/components/SafetyMeasures';
import CtaSection from '@/components/CtaSection';
import { wixClient } from "@/lib/wixClient";
import { RicosContentRenderer } from "@/components/ricos-content-renderer";

interface Treatment {
  _id: string;
  hospitalName: string;
  treatmentName: string;
  image: string;
  ID?: string;
  createdDate?: string;
  updatedDate?: string;
  owner?: string;
  richContent?: Record<string, any> | null;
  enquireNow?: string;
}

const TREATMENTS_COLLECTION_ID = "PersonalizedTreatmentQuotation";
const ITEMS_PER_PAGE = 12;

const getTreatmentIcon = (title: string) => {
  switch (title) {
    case 'Heart Bypass': return <FaHeart className="w-6 h-6 text-primary mr-2" />;
    case 'Valve Replacement': return <FaLungs className="w-6 h-6 text-primary mr-2" />;
    case 'Stenting (Angioplasty)': return <FaPlusCircle className="w-6 h-6 text-primary mr-2" />;
    case 'ASD and VSD Closures': return <FaHeartbeat className="w-6 h-6 text-primary mr-2" />;
    case 'Cancer Treatment': return <FaRibbon className="w-6 h-6 text-primary mr-2" />;
    case 'Tumour Removal': return <FaBrain className="w-6 h-6 text-primary mr-2" />;
    case 'Radiotherapy & Chemotherapy': return <FaXRay className="w-6 h-6 text-primary mr-2" />;
    case 'Bone Marrow Transplants': return <FaSyringe className="w-6 h-6 text-primary mr-2" />;
    case 'Kidney Transplants': return <GiKidneys className="w-6 h-6 text-primary mr-2" />;
    case 'Liver Transplants': return <FaAllergies className="w-6 h-6 text-primary mr-2" />;
    case 'Stone Removal': return <GiStomach className="w-6 h-6 text-primary mr-2" />;
    case 'Brain and Spine Surgeries': return <FaBrain className="w-6 h-6 text-primary mr-2" />;
    case 'Knee and Hip Replacements': return <FaJoint className="w-6 h-6 text-primary mr-2" />;
    case 'Eye Treatment': return <FaEye className="w-6 h-6 text-primary mr-2" />;
    case 'Infertility and IVF': return <FaBaby className="w-6 h-6 text-primary mr-2" />;
    case 'Weight Loss Surgeries': return <FaWeight className="w-6 h-6 text-primary mr-2" />;
    case 'Reconstructive Surgeries': return <FaHandHoldingMedical className="w-6 h-6 text-primary mr-2" />;
    case 'Sexual Health': return <FaVenusMars className="w-6 h-6 text-primary mr-2" />;
    default: return <FaPlusCircle className="w-6 h-6 text-primary mr-2" />;
  }
};

export default function ServicesPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreatments = async () => {
    try {
      const response = await wixClient.items
        .query(TREATMENTS_COLLECTION_ID)
        .limit(ITEMS_PER_PAGE)
        .find({ consistentRead: true });

      if (!response || !response.items) return [];

      return response.items.map((item: any) => ({
        _id: item._id,
        hospitalName: item.hospitalName || "Untitled Treatment",
        treatmentName: item.treatmentName || "No description available.",
        image: item.image || "/placeholder.svg?height=224&width=400&text=Image Not Found",
        richContent: item.richcontent || null,
      }));
    } catch (err) {
      console.error("Error fetching Treatments:", err);
      setError("Failed to load treatments.");
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const data = await fetchTreatments();
      setTreatments(data);
      setLoading(false);
    })();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transform transition-transform duration-300 animate-pulse p-6">
      <div className="w-full h-40 bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 my-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Banner
        topSpanText="Our Specialized Services"
        title="Comprehensive Healthcare Solutions Tailored for You"
        description="Discover our wide range of medical services designed to meet the diverse needs of international patients."
        buttonText="Explore Services"
        buttonLink="/services#list"
        mainImageSrc="/service-main.png"
        mainImageAlt="Medical professionals discussing services"
        bannerBgImage="/service-banner.png"
        mainImageClass="w-[80%] h-[60vh] -left-20 -bottom-6 absolute"
      />

      <section className="container mx-auto py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
          Our Key Treatments
        </h2>

        {error && (
          <div className="mb-8 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <FaExclamationTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <Slider {...sliderSettings}>
            {treatments.map((treatment) => (
              <div key={treatment._id} className="p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={treatment.image}
                    alt={treatment.hospitalName}
                    width={400}
                    height={224}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      {getTreatmentIcon(treatment.hospitalName)}
                      {treatment.hospitalName}
                    </h3>
                    <p className="text-gray-700 text-sm mb-3">{treatment.treatmentName}</p>
                    {treatment.richContent && (
                      <div className="text-gray-600 text-sm">
                        <RicosContentRenderer content={JSON.stringify(treatment.richContent)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      <ProcessSteps />
      <SafetyMeasures />
      <CtaSection />
    </div>
  );
}

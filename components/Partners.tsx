'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function Partners() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const hospitals = [
    { name: 'Apollo', logo: '/hospital-logo/apollo.svg' },
    { name: 'Artemis', logo: '/hospital-logo/artemis-logo1.png' },
    { name: 'Fortis', logo: '/hospital-logo/fortis.png' },
    { name: 'Logo', logo: '/hospital-logo/logo1.png' },
    { name: 'Manipal', logo: '/hospital-logo/manipal-hospitals.webp' },
    { name: 'Max', logo: '/hospital-logo/max-hospital.svg' },
    { name: 'Medanta', logo: '/hospital-logo/medanta.svg' },
    { name: 'Metro', logo: '/hospital-logo/metro-logo.png' },
    { name: 'Rainbow', logo: '/hospital-logo/rainbow-logo.svg' },
    // Optional repetition for continuous scroll effect
    { name: 'Apollo', logo: '/hospital-logo/apollo.svg' },
    { name: 'Artemis', logo: '/hospital-logo/artemis-logo1.png' },
    { name: 'Fortis', logo: '/hospital-logo/fortis.png' },
    { name: 'Logo', logo: '/hospital-logo/logo1.png' },
    { name: 'Manipal', logo: '/hospital-logo/manipal-hospitals.webp' },
    { name: 'Max', logo: '/hospital-logo/max-hospital.svg' },
    { name: 'Medanta', logo: '/hospital-logo/medanta.svg' },
    { name: 'Metro', logo: '/hospital-logo/metro-logo.png' },
    { name: 'Rainbow', logo: '/hospital-logo/rainbow-logo.svg' },
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 30;

    const scroll = () => {
      if (!scrollContainer) return;

      scrollAmount += scrollStep;
      scrollContainer.scrollLeft = scrollAmount;

      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
    };

    const interval = setInterval(scroll, scrollInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="md:py-4 md:py-6 bg-white overflow-hidden" id="Partners">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          ref={scrollRef}
          className="relative py-5 cursor-grab active:cursor-grabbing overflow-x-hidden"
        >
          <div className="flex space-x-4 w-max">
            {[...hospitals, ...hospitals].map((hospital, index) => (
              <div
                key={`${hospital.name}-${index}`}
                className="bg-white p-4 rounded-md shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 w-[100px] h-[70px] md:w-[120px] md:h-[80px] lg:w-[140px] lg:h-[96px] flex-shrink-0"
              >
                <Image
                  src={hospital.logo}
                  alt={hospital.name}
                  width={140}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

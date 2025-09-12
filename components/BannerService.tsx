'use client';

import { FaPhoneAlt } from 'react-icons/fa';
import Image from 'next/image';

interface BannerProps {
  bannerBgImage?: string;
  title: string;
  description: string; // HTML string
  buttonText: string;
  buttonLink: string;
  mainImageSrc: string;
  mainImageAlt: string;
  mainImageClass?: string;
  topSpanText?: string;
  children?: React.ReactNode;
}

export default function Banner({
  bannerBgImage = '/medicine-science.png',
  title,
  description,
  buttonText,
  buttonLink,
  mainImageSrc,
  mainImageAlt,
  mainImageClass,
  topSpanText,
  children,
}: BannerProps) {
  return (
    <section className="relative px-2 md:px-0 overflow-hidden bg-white py-10 h-[70vh]">
      <div className="relative z-20 container mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-12 items-center h-full">
        {/* Left Content */}
        <div className="space-y-2 md:space-y-4 md:pb-20">
          {topSpanText && (
            <span className="inline-block px-0 py-1  text-[#E22026]  text-base font-medium tracking-wide  mb-1">
              {topSpanText}
            </span>
          )}
          <h1 className="heading-lg">{title}</h1>
          <p
            className="description"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Right Image */}
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={mainImageSrc}
            alt={mainImageAlt}
            className={`w-full h-auto max-h-full object-contain rounded-xl ${mainImageClass || ''}`}
          />
        </div>
      </div>
    </section>
  );
}

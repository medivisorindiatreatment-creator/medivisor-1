'use client';

import { FaPhoneAlt } from 'react-icons/fa';
import Image from 'next/image';

interface BannerProps {
  bannerBgImage?: string; // Optional background image for the section
  bannerBgImageClass?: string; // Optional class for background image
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  mainImageSrc?: string;
  mainImageAlt?: string;
  mainImageClass?: string;
  topSpanText?: string;
  children?: React.ReactNode;
}

export default function Banner({
  bannerBgImage = '/medicine-science.png',
  bannerBgImageClass = 'object-contain object-right', // Default styling for background image
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
    <section className="relative overflow-hidden py-16 md:py-24 h-[80vh] flex items-center justify-center text-center">
      {/* Background Image */}
      {/* <div className="absolute inset-0 0">
        <Image
          src={bannerBgImage}
          alt="Background"
          fill
          className={bannerBgImageClass}
          priority
        />
       
      </div> */}
 <div className="absolute inset-0 bg-[#E22026]/10" />
      {/* Background Decorative Shapes */}
    
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-[#E22026]/40 rounded-full blur-2xl z-10" />

      {/* Central Content */}
      <div className="relative z-20 container mx-auto px-4 md:px-12 flex flex-col items-center justify-center h-full max-w-6xl">
        {topSpanText && (
          <span className="text-[#E22026] font-semibold text-sm uppercase tracking-wider mb-2">
            {topSpanText}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold text-black leading-tight mb-4">
          {title}
        </h1>
        <p className="text-gray-800 text-lg leading-relaxed mb-8 max-w-2xl">
          {description}
        </p>

        {(buttonText && buttonLink) && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={buttonLink}
              className="inline-flex items-center gap-2 bg-[#E22026] text-white px-8 py-3 rounded-md text-base font-medium hover:bg-[#c01c22] transition shadow-lg transform hover:scale-105"
            >
              {buttonText}
            </a>
            {children}
          </div>
        )}

        {!buttonText && children && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

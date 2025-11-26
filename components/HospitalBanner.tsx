'use client';

import { FaArrowRight, FaPhoneAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

// Define a type for the primary and secondary CTA buttons
interface CtaButton {
  text: string;
  link: string;
  icon?: React.ReactNode;
  isPrimary?: boolean;
}

interface BannerProps {
  // Styling & Layout Props
  bannerBgImage: string; // Made mandatory for background effect
  // Content Props
  topSpanText?: string;
  title: string;
  description: string; // HTML string for rich text
  // CTA Props
  ctas: CtaButton[]; 
  children?: React.ReactNode;
  // NOTE: mainImageSrc, mainImageAlt, mainImageClass, layoutType are REMOVED as requested.
}

/**
 * A professional, single-column Hero Banner with a full-bleed background image and 70vh height.
 */
export default function CleanHeroBanner({
  bannerBgImage,
  title,
  description,
  ctas,
  topSpanText,
  children,
}: BannerProps) {

  // Default to a distinct primary CTA style
  const primaryCta = ctas.find(cta => cta.isPrimary) || ctas[0];
  // Default to a distinct secondary CTA style
  const secondaryCta = ctas.find(cta => !cta.isPrimary && cta !== primaryCta);

  // Helper function to render a CTA button
  const renderCta = (cta: CtaButton, className: string) => (
    <Link 
      href={cta.link}
      className={`
        ${className} 
        inline-flex items-center justify-center font-medium tracking-wide transition duration-300 ease-in-out
        text-base px-6 py-3 rounded-lg
      `}
    >
      {cta.icon && <span className="mr-2">{cta.icon}</span>}
      {cta.text}
    </Link>
  );

  return (
    <section 
      // Set to 70vh minimum height and light theme
      className="relative px-4 md:px-0 overflow-hidden bg-gray-50 text-gray-900 min-h-[70vh] flex items-center"
    >
      {/* Background Image (Full-bleed, subtle, mandatory) */}
      <Image
        src={bannerBgImage}
        alt="Banner background"
        layout="fill"
        objectFit="cover"
        quality={80}
        // Increased contrast for background image and added a gradient overlay
        className="opacity-80 absolute inset-0 z-0" 
      />
      
      {/* Dark Overlay for better text readability */}
  

      {/* Content Container (Centered for clean single-column layout) */}
      <div className="relative z-10 container mx-auto h-full py-16 md:py-0">
        <div className="grid grid-cols-2 justify-items-start ">
          
          {/* Main Content Area */}
          <div>
            <div className="space-y-2 lg:space-y-3">
              
              {/* Top Span Text */}
              {topSpanText && (
                <span className="inline-block text-base uppercase text-[#E22026] font-medium tracking-widest border-l-2 border-red-700 pl-2">
                  {topSpanText}
                </span>
              )}
              
              {/* Main Title - Professional Typography (Large, clean, leading-snug) */}
              <h1 className="heading-lg">
                {title}
              </h1>
              
              {/* Description - Highly readable, medium dark gray text */}
              <div 
                className="text-xl text-gray-700 max-w-2xl leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: description }}
              />

              {/* CTA Buttons */}
              {(primaryCta || secondaryCta) && (
                <div className="flex flex-wrap gap-4 pt-4">
                  
                  {/* Primary CTA - Focus on professional, deep contrast color */}
                  {primaryCta && renderCta(primaryCta, `
                    bg-[#E22026] cursor-pointer md:block hidden hover:bg-[#74BF44] text-white font-medium px-5 py-2 rounded-md shadow-md transition-all
                  `)}
                  
                  {/* Secondary/Contact CTA - Clean, outline style */}
                  {secondaryCta && renderCta(secondaryCta, `
                    text-gray-800 border-2 border-gray-300 bg-white hover:bg-gray-100
                  `)}

                </div>
              )}
            </div>
            {children}
          </div>
          
        </div>
      </div>
    </section>
  );
}
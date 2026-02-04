"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Users, MapPin, Star } from "lucide-react"
import type { ExtendedDoctorType, SpecialtyType } from '@/types/search'
import { getWixImageUrl, generateSlug, formatLocation } from '@/types/search'

type DoctorCardProps = {
  doctor: ExtendedDoctorType
}

const ScrollableTitle = ({ text, className, isHovered }: { text: string; className?: string; isHovered: boolean }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [animationDuration, setAnimationDuration] = useState('0s');

  React.useEffect(() => {
    const checkOverflow = () => {
      const rAF = window.requestAnimationFrame(() => {
        if (containerRef.current && textRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const textWidth = textRef.current.scrollWidth;

          if (textWidth > containerWidth) {
            setIsOverflowing(true);
            const duration = textWidth / 50;
            setAnimationDuration(`${Math.max(duration, 5)}s`);
          } else {
            setIsOverflowing(false);
            setAnimationDuration('0s');
          }
        }
      });
      return () => window.cancelAnimationFrame(rAF);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile: show 2 lines (no hover effects)
  if (isMobile) {
    return (
      <div className={`${className} line-clamp-2`}>
        {text}
      </div>
    );
  }

  // On desktop: use original marquee logic
  const isMarqueeActive = isOverflowing && isHovered;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      <div
        className={`whitespace-nowrap inline-block ${!isMarqueeActive ? 'truncate w-full' : ''}`}
        style={{
          animation: isMarqueeActive ? `marquee ${animationDuration} linear infinite` : 'none',
          transform: 'translateX(0)',
        }}
      >
        <span ref={textRef} className="inline-block pr-8">
          {text}
        </span>

        {isMarqueeActive && (
          <span className="inline-block pr-8">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Helper to safely extract the name/title from a specialization object or return the string
  const getSpecializationName = (s: any): string => {
    if (typeof s === "object" && s !== null) {
      return (s as any).name || (s as any).title || ""
    }
    return String(s)
  }

  // 1. Convert specialization data into a clean array of names
  const specializationArray = useMemo(() => {
    return (Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization])
      .map(getSpecializationName)
      .filter(Boolean)
  }, [doctor.specialization])

  // 2. Determine the display string: Primary specialization + Count (+N)
  const specializationDisplay = useMemo(() => {
    if (specializationArray.length === 0) {
      return "Specialty not specified";
    }

    const primary = specializationArray[0];
    const remainingCount = specializationArray.length - 1;

    if (remainingCount > 0) {
      // Example: "Cardiology +1"
      return `${primary} +${remainingCount} Specialties`;
    }

    // Example: "Cardiology"
    return primary;
  }, [specializationArray]);
  // --- END Specialization Logic ---


  const slug = generateSlug(`${doctor.doctorName}`);
  const imageUrl = getWixImageUrl(doctor.profileImage);

  // Location display: Format "City, State, Country"
  // All data fetched from Wix CMS, Delhi NCR cities normalized
  const primaryLocationDisplay = useMemo(() => {
    // Handle both ExtendedDoctorData and regular doctor data
    const locations = (doctor as any).filteredLocations || doctor.locations

    if (!locations || locations.length === 0) {
      return "Location not specified"
    }

    const first = locations[0]
    const cityData = first?.cities?.[0]
    
    // Format: "City, State, Country" (e.g., "Gurugram, Delhi NCR, India")
    return formatLocation(cityData)
  }, [doctor])

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <Link href={`/doctors/${slug}`} className="block">
      <article
        className="group bg-white xs md:mb-0 mb-5 rounded-xs shadow-lg md:shadow-xs transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-sm border border-gray-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-72 md:h-48 overflow-hidden bg-gray-50">
          {doctor.popular && (
            <span className="absolute top-3 right-3 z-10 inline-flex items-center text-sm bg-gray-50 text-gray-600 font-medium px-3 py-2 rounded-xs shadow-sm border border-gray-100">
              <Star className="w-3 h-3 mr-1 fill-gray-300 text-gray-400" />Popular
            </span>
          )}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={doctor.doctorName}
              className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-200" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        </div>

        <div className="p-3 flex-1 flex flex-col md:space-y-1">
          <div className="md:space-y-2 flex-1 min-h-0">
            <h2 className="md:text-lg text-2xl font-medium leading-[20px] text-gray-900 transition-colors">
              <ScrollableTitle text={doctor.doctorName} isHovered={isHovered} /> {/* PASSED prop */}
            </h2>

          </div>

          <div className="flex gap-x-2 mb-2 md:mt-0 mt-2 mb:mb-0">
            <p className=" text-lg md:text-sm text-gray-900 font-normal flex items-center gap-2 line-clamp-1">
              {specializationDisplay}
            </p>
            <p className=" text-lg md:text-sm text-gray-900 font-normal flex items-center gap-2">
              {doctor.experienceYears}+ Years Exp.
            </p>
          </div>

          <footer className="border-t border-gray-100 pt-2">
            <p className="text-lg md:text-sm text-gray-900 font-normal flex items-center gap-2 line-clamp-1">
              <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
              {primaryLocationDisplay}
            </p>
          </footer>
        </div>
      </article>
    </Link>
  )
}

export default DoctorCard
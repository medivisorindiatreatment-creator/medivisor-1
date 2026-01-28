"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Stethoscope } from "lucide-react"
import { Inter } from "next/font/google"
import MarqueeHeading from "./MarqueeHeading"
import { generateSlug, getDoctorImage } from "../utils"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

const DoctorCard = ({ doctor }: { doctor: any }) => {
  const [isHovered, setIsHovered] = useState(false)
  const doctorImage = getDoctorImage(doctor.profileImage)
  const specializationDisplay = useMemo(() => {
    const getSpecializationName = (s: any): string => {
      if (typeof s === "object" && s !== null) return s.name || s.title || ""
      return String(s)
    }
    const specializationArray = (Array.isArray(doctor.specialization) ? doctor.specialization : [doctor.specialization])
      .map(getSpecializationName)
      .filter(Boolean)
    if (specializationArray.length === 0) return "General Practitioner"
    const primary = specializationArray[0]
    const remainingCount = specializationArray.length - 1
    return remainingCount > 0 ? `${primary} +${remainingCount} Specialties` : primary
  }, [doctor.specialization])
  const doctorSlug = generateSlug(doctor.doctorName)

  return (
    <Link
      href={`/doctors/${doctorSlug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col h-full bg-white border md:border-gray-100 border-gray-200 rounded-xs shadow-lg md:shadow-sm hover:shadow-md overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-gray-400/50"
    >
      <div className="relative h-72 md:h-60 overflow-hidden bg-gray-50 rounded-t-lg">
        {doctorImage ? (
          <img src={doctorImage} alt={`${doctor.doctorName}, ${specializationDisplay}`} className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} onError={(e) => { e.currentTarget.style.display = "none" }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100"><Stethoscope className="w-12 h-12 text-gray-300" /></div>
        )}
      </div>
      <div className={`p-3 flex-1 flex flex-col ${inter.variable} font-light`}>
        <div className="overflow-hidden mb-1">
          <MarqueeHeading isHovered={isHovered}>
            <h3 className="text-2xl md:text-lg font-medium text-gray-900 leading-tight">
              {doctor.doctorName}
            </h3>
          </MarqueeHeading>
        </div>
        <div className="gap-1">
          <p className="text-gray-700 text-base md:text-sm flex items-center line-clamp-1">{specializationDisplay}</p>
          {doctor.experienceYears && <p className="text-gray-700 text-base md:text-sm flex items-center line-clamp-1">{doctor.experienceYears} years of exp</p>}
        </div>
      </div>
    </Link>
  )
}

export default DoctorCard
"use client"

import Link from "next/link"
import { User } from "lucide-react"
import ImageWithFallback from "./ImageWithFallback"
import InfiniteHoverScroll from "./InfiniteHoverScroll"
import { getImageUrl, generateSlug } from "../utils"

const DoctorCard = ({ doctor }: { doctor: any }) => {
  const doctorImage = getImageUrl(doctor.profileImage)
  const doctorSlug = generateSlug(doctor.doctorName || 'doctor')
  const specializationNames = Array.isArray(doctor.specialization) ? doctor.specialization.map((s: any) => s.name).join(', ') || 'Specialist' : 'Specialist'
  const expText = doctor.experienceYears ? `${doctor.experienceYears} yrs Exp.` : 'Experience N/A'

  return (
    <Link href={`/doctors/${doctorSlug}`}
      className={`group block h-full border border-gray-100 rounded-xs shadow-xs bg-white hover:shadow-sm transition-all duration-300 relative flex flex-col overflow-hidden transform hover:-translate-y-0.5`}
    >
      <div className="relative h-60 overflow-hidden bg-gray-50">
        <ImageWithFallback src={doctorImage} alt={`Dr. ${doctor.doctorName}`} fallbackIcon={User} className="object-cover w-full h-full group-hover:scale-[1.05] transition-transform duration-500" fallbackClassName="bg-gray-50" />
      </div>
      <div className={`flex flex-col flex-1 p-4 font-light`}>
        <div className="mb-2">
          <InfiniteHoverScroll
            className="text-lg font-medium text-gray-800 leading-snug group-hover:text-gray-700 transition-colors"
            speed={40}
          >
            {doctor.doctorName}
          </InfiniteHoverScroll>
        </div>
        <div className="mb-1">
          <InfiniteHoverScroll
            className="text-sm font-medium text-gray-800"
            speed={35}
          >
            <span>{specializationNames}</span>
          </InfiniteHoverScroll>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {expText}
        </p>
      </div>
    </Link>
  )
}

export default DoctorCard
"use client"

import Link from "next/link"
import { Users, Star } from "lucide-react"
import type { DoctorData, DepartmentData, CityData } from "@/lib/cms/types"

interface DoctorCardProps {
  doctor: DoctorData
  departments?: DepartmentData[]
  displayLocation?: string
}

export default function DoctorCard({ doctor, departments = [], displayLocation }: DoctorCardProps) {
  // Get profile image - handle both Wix format and direct URLs
  const getProfileImageUrl = (imageStr: string | null | undefined): string | null => {
    if (!imageStr || typeof imageStr !== "string") return null
    
    // Handle Wix image URLs
    if (imageStr.startsWith("wix:image://v1/")) {
      const parts = imageStr.split("/")
      return parts.length >= 4 ? `https://static.wixstatic.com/media/${parts[3]}` : null
    }
    
    // Handle direct URLs
    if (imageStr.startsWith("http://") || imageStr.startsWith("https://")) {
      return imageStr
    }
    
    return null
  }

  const profileImage = doctor.profileImage ? getProfileImageUrl(doctor.profileImage) : null
  const doctorSlug = (doctor.doctorName || "").toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")

  // Get departments from props or from doctor data
  const doctorDepts = departments.length > 0 ? departments : (doctor.specialization || [])
  const firstDepartmentName = doctorDepts[0]?.name
  const remainingDepartmentCount = doctorDepts.length > 1 ? Math.min(doctorDepts.length - 1, 2) : 0

  return (
    <Link href={`/doctors/${doctorSlug}`} className="block">
      <article className="group bg-white rounded-sm shadow-sm transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-md border border-gray-100">
        <div className="relative h-48 overflow-hidden bg-gray-50">
          {doctor.popular && (
            <span className="absolute top-3 right-3 z-10 inline-flex items-center text-sm bg-gray-50 text-gray-600 font-medium px-3 py-2 rounded-sm shadow-sm border border-gray-100">
              <Star className="w-3 h-3 mr-1 fill-gray-300 text-gray-400" />
              Popular
            </span>
          )}
          {profileImage ? (
            <img
              src={profileImage}
              alt={doctor.doctorName}
              className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-200" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        </div>

        <div className="p-3 flex-1 flex flex-col space-y-2">
          <header className="space-y-2 flex-1 min-h-0">
            <h2 className="text-lg font-medium leading-tight line-clamp-2 text-gray-900 group-hover:text-gray-800">
              {doctor.doctorName}
            </h2>
          </header>

          <div className="space-y-2">
            {firstDepartmentName && (
              <div className="flex flex-wrap gap-1">
                <span className="inline-flex items-center text-sm font-medium text-gray-900">
                  {firstDepartmentName}
                </span>
                {remainingDepartmentCount > 0 && (
                  <span className="inline-flex items-center text-sm font-medium text-gray-900">
                    +{remainingDepartmentCount} Department
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-900 font-normal">{doctor.experienceYears} Years Exp.</p>
            </div>
          </div>

          <footer className="border-t border-gray-100 pt-2 mt-auto">
            <p className="text-sm text-gray-600 font-normal line-clamp-1">
              {displayLocation || "View Location"}
            </p>
          </footer>
        </div>
      </article>
    </Link>
  )
}

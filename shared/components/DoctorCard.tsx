"use client"

import { Users, Star } from "lucide-react"
import Link from "next/link"
import { getWixImageUrl, generateSlug, cleanHospitalName } from "../utils"

interface Doctor {
  _id: string
  doctorName: string
  specialization: any[]
  qualification: string | null
  experienceYears: string | null
  designation: string | null
  aboutDoctor: string | null
  profileImage: string | null
  popular?: boolean
  locations: { hospitalName: string; hospitalId: string; branchName?: string; branchId?: string; cities: any[] }[]
  departments: { _id: string; name: string }[]
}

interface DoctorCardProps {
  doctor: Doctor
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const profileImage = doctor.profileImage ? getWixImageUrl(doctor.profileImage) : null
  const doctorSlug = generateSlug(doctor.doctorName)

  // Prioritize the first location that has a branchName for proper branch display; fallback to first location
  const primaryLocation = doctor.locations.find(loc => loc.branchName) || doctor.locations[0]
  // Use branchName if available, else cleaned hospitalName
  const displayLocation = primaryLocation?.branchName || cleanHospitalName(primaryLocation?.hospitalName) || 'N/A'

  // --- UPDATED LOGIC FOR DEPARTMENT BADGES ---

  // Get the name of the first department
  const firstDepartmentName = doctor.departments[0]?.name

  // Calculate the number of remaining departments to display, up to a maximum of 3 total (1 displayed name + max 2 in the count)
  const remainingDepartmentCount = doctor.departments.length > 1
    ? Math.min(doctor.departments.length - 1, 2) // Max out at +2 (for 3 or more departments)
    : 0

  // --- END OF UPDATED LOGIC ---

  return (
    <Link href={`/doctors/${doctorSlug}`} className="block">
      <article className="group bg-white rounded-xs shadow-xs transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-sm border border-gray-100">
        <div className="relative h-48 overflow-hidden bg-gray-50">
          {doctor.popular && (
            <span className="absolute top-3 right-3 z-10 inline-flex items-center text-sm bg-gray-50 text-gray-600 font-medium px-3 py-2 rounded-xs shadow-sm border border-gray-100">
              <Star className="w-3 h-3 mr-1 fill-gray-300 text-gray-400" />Popular
            </span>
          )}
          {profileImage ? (
            <img
              src={profileImage}
              alt={doctor.doctorName}
              className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.currentTarget.style.display = "none" }}
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
            <h2 className="text-lg font-medium leading-tight line-clamp-2 text-gray-900 group-hover:text-gray-800 transition-colors">
              {doctor.doctorName}
            </h2>
          </header>

          <div className="space-y-2">
            {/* Department Badges (First Name + Remaining Count) */}
            {firstDepartmentName && (
              <div className="flex flex-wrap gap-1">
                {/* First Department Name */}
                <span
                  className="inline-flex items-center text-sm font-medium text-gray-900"
                >
                  {firstDepartmentName}
                </span>

                {/* Remaining Departments Count Badge */}
                {remainingDepartmentCount > 0 && (
                  <span
                    className="inline-flex items-center text-sm font-medium text-gray-900"
                  >
                    +{remainingDepartmentCount} Department
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* Implemented the green dot icon as per design notes in the file context */}
              <div className="w-2 h-2 bg-[#74BF44] rounded-full flex-shrink-0"></div>
              <p className="text-sm text-gray-900 font-normal">
                {doctor.experienceYears} Years Exp.
              </p>
            </div>
          </div>

          <footer className="border-t border-gray-100 pt-2 mt-auto">
            <p className="text-sm text-gray-900/70 font-normal line-clamp-1">
              {displayLocation}
            </p>
          </footer>
        </div>
      </article>
    </Link>
  )
}
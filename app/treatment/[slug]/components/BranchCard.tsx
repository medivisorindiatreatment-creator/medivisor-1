"use client"

import Image from "next/image"
import Link from "next/link"
import { Hospital } from "lucide-react"
import type { BranchData, HospitalData } from "@/lib/cms/types"

// Helper functions for Wix image URLs
const getWixImageUrl = (imageStr: string | null | undefined): string | null => {
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

  // Handle relative paths
  if (imageStr.startsWith("/")) {
    return imageStr
  }

  return null
}

const generateSlug = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return ""
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
}

interface BranchCardProps {
  branch: BranchData
  hospital: HospitalData
  treatmentCost?: string | null
  treatmentDuration?: string | null
  matchingDoctorsCount?: number
}

export default function BranchCard({ 
  branch, 
  hospital, 
  treatmentCost, 
  treatmentDuration, 
  matchingDoctorsCount 
}: BranchCardProps) {
  const branchSlug = generateSlug(branch.branchName)
  const hospitalLogoUrl = hospital.logo ? getWixImageUrl(hospital.logo) : null
  
  // Get branch image with proper URL transformation
  const rawBranchImage = branch.branchImage || null
  const branchImage = rawBranchImage ? getWixImageUrl(rawBranchImage) : null
  
  // Get city info
  const firstCity = branch.city?.[0]?.cityName || "City"
  
  // Get specialty info - handle both field names
  const specs = branch.specialization || branch.specialty || []
  const firstSpecialty = specs[0]?.name || "Specialty"
  
  // Get stats
  const estdYear = branch.yearEstablished || "N/A"
  const bedsCount = branch.totalBeds || "0"
  const doctorsCount = branch.noOfDoctors || "0"

  return (
    <Link href={`/search/hospitals/${branchSlug}`} className="block w-full">
      <article className="border border-gray-100 rounded-sm shadow-sm bg-white hover:shadow-md transition-shadow relative flex flex-col overflow-hidden h-full">
        <div className="relative w-full h-48 bg-gray-100">
          {branchImage ? (
            <Image
              src={branchImage}
              alt={`${branch.branchName} facility`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Hospital className="w-12 h-12 text-gray-300" />
            </div>
          )}
          {hospitalLogoUrl && (
            <div className="absolute bottom-2 left-2 z-10">
              <img
                src={hospitalLogoUrl}
                alt={`${hospital.hospitalName} logo`}
                className="w-12 h-auto object-contain"
              />
            </div>
          )}
          {treatmentCost && (
            <div className="absolute top-2 right-2 z-10 bg-[#74BF44]/90 text-white text-xs font-medium px-2 py-1 rounded-sm">
              From ${treatmentCost}
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col space-y-2">
          <h3 className="text-xl md:text-base font-medium text-[#241d1f] leading-tight line-clamp-2">
            {branch.branchName}
          </h3>
          <p className="text-base md:text-sm text-[#241d1f]/80 line-clamp-1">
            {firstCity}, {firstSpecialty} Speciality
          </p>
          {matchingDoctorsCount !== undefined && matchingDoctorsCount > 0 && (
            <p className="text-base md:text-sm text-[#74BF44] font-medium">
              Matching Doctors: {matchingDoctorsCount}
            </p>
          )}
          {treatmentDuration && (
            <p className="text-sm text-gray-500">Duration: {treatmentDuration}</p>
          )}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-base md:text-sm font-medium text-[#241d1f]">{estdYear}</p>
              <p className="text-base md:text-sm text-[#241d1f]">Estd.</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-base md:text-sm font-medium text-[#241d1f]">{bedsCount}+</p>
              <p className="text-base md:text-sm text-[#241d1f]">Beds</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-base md:text-sm font-medium text-[#241d1f]">{doctorsCount}+</p>
              <p className="text-base md:text-sm text-[#241d1f]">Doctors</p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

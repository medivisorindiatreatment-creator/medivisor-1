"use client"

import Link from "next/link"
import { Hospital, MapPin } from "lucide-react"
import ImageWithFallback from "./ImageWithFallback"
import InfiniteHoverScroll from "./InfiniteHoverScroll"
import AccreditationPill from "./AccreditationPill"
import { getImageUrl, generateSlug, getHospitalCity } from "../utils"
import type { HospitalWithBranchPreviewExtended } from "../types"

const SimilarHospitalCard = ({ hospital }: { hospital: HospitalWithBranchPreviewExtended }) => {
  const hospitalImage = getImageUrl(hospital.hospitalImage) || getImageUrl(hospital.logo)
  const hospitalSlug = hospital.slug ? hospital.slug.replace(/^\/+/, '') : generateSlug(hospital.hospitalName)
  const hospitalCity = hospital.city || getHospitalCity(hospital)
  const branchCount = hospital.branches?.length || 0

  return (
    <Link href={`/search/${hospitalSlug}`}
      className={`group block h-full border border-gray-100 rounded-xs shadow-xs bg-white hover:shadow-sm transition-all duration-300 relative flex flex-col overflow-hidden transform hover:-translate-y-0.5`}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <ImageWithFallback src={hospitalImage} alt={hospital.hospitalName} fallbackIcon={Hospital} className="object-cover w-full h-full " />
        {hospital.accreditations && hospital.accreditations.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {hospital.accreditations.slice(0, 1).map((acc) => (
              <AccreditationPill key={acc._id} acc={acc} logoOnly={false} />
            ))}
          </div>
        )}
      </div>
      <div className={`flex flex-col flex-1 p-2 font-light`}>
        <div className="mb-2">
          <InfiniteHoverScroll
            className="text-lg font-medium text-gray-900 mb-0 group-hover:text-gray-700 transition-colors"
            speed={42}
          >
            {hospital.hospitalName}
          </InfiniteHoverScroll>
        </div>
        {hospitalCity && (
          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="truncate">{hospitalCity}</span>
          </p>
        )}
      </div>
    </Link>
  )
}

export default SimilarHospitalCard
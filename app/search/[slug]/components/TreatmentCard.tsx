"use client"

import Link from "next/link"
import { Scissors, Clock } from "lucide-react"
import ImageWithFallback from "./ImageWithFallback"
import InfiniteHoverScroll from "./InfiniteHoverScroll"
import { getImageUrl, generateSlug } from "../utils"

const TreatmentCard = ({ treatment }: { treatment: any }) => {
  const treatmentImage = getImageUrl(treatment.treatmentImage)
  const treatmentSlug = generateSlug(treatment.name || 'treatment')

  return (
    <Link href={`/treatments/${treatmentSlug}`}
      className={`group block h-full border border-gray-100 rounded-xs shadow-xs bg-white hover:shadow-sm transition-all duration-300 relative flex flex-col overflow-hidden transform hover:-translate-y-0.5`}
    >
      <div className="relative h-40 overflow-hidden bg-gray-50">
        <ImageWithFallback src={treatmentImage} alt={treatment.name} fallbackIcon={Scissors} className="object-cover w-full h-full group-hover:scale-[1.05] transition-transform duration-500" fallbackClassName="bg-gray-50" />
      </div>
      <div className={`flex flex-col flex-1 p-4 font-light`}>
        <div className="mb-3">
          <InfiniteHoverScroll
            className={`text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors font-serif`}
            speed={38}
          >
            {treatment.name}
          </InfiniteHoverScroll>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
          {treatment.cost && (
            <div className="flex items-center gap-1 text-base font-bold text-gray-700 bg-gray-100/70 px-2.5 py-0.5 rounded-full border border-gray-200">
              <span>{treatment.cost}</span>
            </div>
          )}
          {treatment.duration && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{treatment.duration}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default TreatmentCard
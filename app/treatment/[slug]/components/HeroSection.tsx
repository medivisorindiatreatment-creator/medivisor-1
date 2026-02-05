"use client"

import Image from "next/image"
import { Calendar, Award, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ExtendedTreatmentData } from "@/lib/cms/types"
import { getWixImageUrl } from "@/lib/cms"

interface HeroSectionProps {
  treatment: ExtendedTreatmentData
  totalDoctors: number
  filteredDoctorsCount: number
}

// Utility to extract image from content (Wix format support)
const getContentImage = (content: any): string | null => {
  if (!content) return null
  
  // Handle direct string URLs
  if (typeof content === "string") {
    if (content.startsWith("wix:image://v1/")) {
      const parts = content.split("/")
      return parts.length >= 4 ? `https://static.wixstatic.com/media/${parts[3]}` : null
    }
    if (content.startsWith("http://") || content.startsWith("https://")) {
      return content
    }
    return null
  }
  
  // Handle Wix rich text format with nodes
  if (!content.nodes) return null
  const imageNode = content.nodes.find((node: any) => node.type === "IMAGE")
  if (imageNode?.imageData?.image?.src?.id) {
    return `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`
  }
  return null
}

export default function HeroSection({ treatment, totalDoctors, filteredDoctorsCount }: HeroSectionProps) {
  const router = useRouter()
  const treatmentImage = treatment.treatmentImage ? getContentImage(treatment.treatmentImage) : null

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh]">
      {treatmentImage ? (
        <Image
          src={treatmentImage}
          alt={`${treatment.name} treatment`}
          fill
          priority
          className="object-cover object-top"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full z-10 md:px-4 pb-12 text-white">
        <div className="container mx-auto space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
            {treatment.name}
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed text-white/90">
            {treatment.category || "Specialized Treatment"}
            {totalDoctors > 0 && ` - ${filteredDoctorsCount} Specialist Doctors Available`}
          </p>
          <div className="mt-6 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search treatments by name or specialist..."
                className="w-full pl-4 pr-12 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-sm text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-[#74BF44]/50 focus:border-[#74BF44]/50 transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const query = (e.target as HTMLInputElement).value.trim()
                    if (query) {
                      router.push(`/search?view=treatments&treatment=${encodeURIComponent(query)}`)
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  const query = input.value.trim()
                  if (query) {
                    router.push(`/search?view=treatments&treatment=${encodeURIComponent(query)}`)
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#74BF44]"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

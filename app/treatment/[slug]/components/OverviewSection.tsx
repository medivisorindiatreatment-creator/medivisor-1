"use client"

import { Calendar, Award } from "lucide-react"
import type { ExtendedTreatmentData } from "@/lib/cms/types"
import RichTextDisplay from "@/lib/ui/RichTextDisplay"

interface OverviewSectionProps {
  treatment: ExtendedTreatmentData
}

export default function OverviewSection({ treatment }: OverviewSectionProps) {
  return (
    <section className="bg-white first-heading rounded-sm border border-gray-100 p-4 md:p-6 shadow-sm">
      {treatment.description && (
        <RichTextDisplay htmlContent={treatment.description} className="mt-6" />
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {treatment.category && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100">
            <div className="w-3 h-3 bg-[#74BF44] rounded-full" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Category</p>
              <p className="text-sm text-gray-700">{treatment.category}</p>
            </div>
          </div>
        )}
        {treatment.duration && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Duration</p>
              <p className="text-sm text-gray-700">{treatment.duration}</p>
            </div>
          </div>
        )}
        {treatment.cost && (
          <div className="flex items-center gap-3 p-4 bg-[#74BF44]/10 rounded-sm border border-[#74BF44]/20">
            <Award className="w-5 h-5 text-[#74BF44]" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Estimated Cost</p>
              <p className="text-sm text-gray-700">${treatment.cost}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

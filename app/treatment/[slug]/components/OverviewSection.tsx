"use client"

import { Calendar, Award } from "lucide-react"
import type { ExtendedTreatmentData } from "@/lib/cms/types"

interface OverviewSectionProps {
  treatment: ExtendedTreatmentData
}

export default function OverviewSection({ treatment }: OverviewSectionProps) {
  return (
    <section className="bg-white first-heading rounded-sm border border-gray-100 p-4 md:p-6 shadow-sm">
      {treatment.description && (
        <div
          className="prose max-w-none text-gray-700 leading-relaxed 
            prose-h1:text-3xl prose-h1:font-extrabold prose-h1:mt-8 prose-h1:mb-4 prose-h1:text-gray-900
            prose-h2:text-2xl prose-h2:font-extrabold prose-h2:mt-7 prose-h2:mb-4 prose-h2:text-gray-900
            prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800
            prose-p:font-sans prose-p:mt-3 prose-p:mb-3 prose-p:text-base prose-p:text-gray-700
            prose-a:text-blue-600 prose-a:font-medium prose-a:underline hover:prose-a:text-blue-800"
          dangerouslySetInnerHTML={{ __html: treatment.description }}
        />
      )}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
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

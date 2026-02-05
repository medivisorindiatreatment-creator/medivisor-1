"use client"

import { Hospital } from "lucide-react"
import EmblaCarousel from "./EmblaCarousel"
import type { HospitalWithBranchPreviewExtended } from "../types"

const SimilarHospitalsSection = ({ similarHospitals }: { similarHospitals: HospitalWithBranchPreviewExtended[] }) => {
  if (!similarHospitals || similarHospitals.length === 0) return null

  return (
    <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-8 shadow-md">
      <EmblaCarousel
        items={similarHospitals}
        title="Similar Hospital Groups"
        icon={Hospital}
        type="hospitals"
      />
    </section>
  )
}

export default SimilarHospitalsSection
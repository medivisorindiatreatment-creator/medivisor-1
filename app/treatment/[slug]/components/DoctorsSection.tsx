"use client"

import { useMemo } from "react"
import type { DoctorInfo } from "../utils"
import DoctorCard from "./DoctorCard"

interface DoctorsSectionProps {
  title: string
  doctors: DoctorInfo[]
  totalDoctors: number
}

export default function DoctorsSection({ title, doctors, totalDoctors }: DoctorsSectionProps) {
  // Sort doctors by experience (most experienced first)
  const sortedDoctors = useMemo(() => {
    return [...doctors].sort((a, b) => b.totalExperience - a.totalExperience)
  }, [doctors])

  if (sortedDoctors.length === 0) return null

  return (
    <section className="bg-white rounded-sm border border-gray-100 p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-xl font-medium text-gray-900">
          {totalDoctors} Specialist Doctor{totalDoctors !== 1 ? "s" : ""} for {title}
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {sortedDoctors.map((docData) => {
          // Get primary location for display
          const primaryLocation = docData.hospitals[0]
          const displayLocation = primaryLocation?.branchName || primaryLocation?.hospitalName || "View Location"

          return (
            <DoctorCard
              key={docData.doctor._id}
              doctor={docData.doctor}
              departments={docData.departments}
              displayLocation={displayLocation}
            />
          )
        })}
      </div>
    </section>
  )
}

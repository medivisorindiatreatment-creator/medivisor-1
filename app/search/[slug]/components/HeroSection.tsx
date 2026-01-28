"use client"

import { CalendarDays, Hospital } from "lucide-react"
import Image from "next/image"
import ImageWithFallback from "./ImageWithFallback"
import AccreditationPill from "./AccreditationPill"
import { getImageUrl } from "../utils"
import type { HospitalWithBranchPreviewExtended, AccreditationType } from "../types"

const HeroSection = ({ hospital, accreditations }: { hospital: HospitalWithBranchPreviewExtended, accreditations: AccreditationType[] }) => {
  const hospitalImage = getImageUrl(hospital.hospitalImage)
  const hospitalLogo = getImageUrl(hospital.logo)

  return (
    <section className="relative w-full h-[55vh] md:h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={hospitalImage}
          alt={`Exterior of ${hospital.hospitalName}`}
          fallbackIcon={Hospital}
          className="object-cover"
          fallbackClassName="bg-gray-800"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

      <div className="absolute top-4 left-6 right-6 z-10 flex justify-end items-start container mx-auto">
        {accreditations.length > 0 && (
          <div className="md:flex flex-col items-end gap-2 p-3">
            <div className="md:flex flex-wrap justify-end gap-2">
              {accreditations.slice(0, 5).map((acc: AccreditationType) => (
                <AccreditationPill key={acc._id} acc={acc} logoOnly={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-10 left-0 right-0 p-6 md:p-10 container mx-auto z-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-grow">
          {hospitalLogo ? (
            <div className="w-24 h-auto bg-white p-0 rounded-lg shadow-xl flex items-center justify-center flex-shrink-0 border-4 border-white">
              <Image
                src={hospitalLogo}
                alt={`${hospital.hospitalName} Logo`}
                width={160}
                height={100}
                className="object-contain w-full h-auto max-h-[100px]"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-white/90 p-3 rounded-lg shadow-xl flex items-center justify-center flex-shrink-0 border-4 border-white">
              <Hospital className="w-12 h-12 text-gray-700" />
            </div>
          )}
          <div className="">
            {hospital.yearEstablished && (
              <div className={`flex items-center gap-2 text-lg text-gray-300`}>
                <CalendarDays className="w-5 h-5 text-gray-400" />
                <span>Estd. {hospital.yearEstablished}</span>
              </div>
            )}
            <h1 className={`text-3xl md:text-3xl font-medium text-white leading-tight drop-shadow-2xl`}>
              {hospital.hospitalName}
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
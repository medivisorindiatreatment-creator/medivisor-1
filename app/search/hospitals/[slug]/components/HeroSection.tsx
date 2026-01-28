"use client"

import { MapPin, Phone } from "lucide-react"
import { getBranchImage, getHospitalImage, getHospitalLogo, getWixImageUrl } from "../utils"

const HeroSection = ({ heroImage, branch, hospital, hospitalLogo, accreditationImages }: any) => (
  <section className="relative w-full h-[50vh] md:h-[80vh] bg-gray-50">
    {heroImage && <img src={heroImage} alt={`${branch.branchName} - ${hospital.hospitalName}`} className="object-cover object-center w-full h-full" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} onError={(e) => { e.currentTarget.style.display = "none" }} />}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

    {accreditationImages.length > 0 && (
      <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-8">
        <div className="flex flex-wrap justify-end gap-3">
          {accreditationImages.map((acc: any) => (
            acc.image && (
              <div
                key={acc._id}
                className="relative group"
                title={acc.title || "Accreditation"}
              >
                <img
                  src={acc.image}
                  alt={`${acc.title || ''} accreditation badge`}
                  className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full bg-white/90 backdrop-blur-sm p-0 shadow-lg transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = "none" }}
                />
                {acc.title && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {acc.title}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    )}

    <div className="absolute bottom-0 left-0 right-0 z-10 md:pb-12 pb-5 text-white">
      <div className="container mx-auto md:px-6 space-y-3">
        <div className="md:flex md:gap-x-4 items-center">
          {hospitalLogo && (
            <div className="relative w-16 h-auto md:h-16 bg-white md:rounded-full p-2 shadow-lg flex-shrink-0">
              <img src={hospitalLogo} alt={`${hospital.hospitalName} logo`} className="object-contain rounded-full w-full h-full" onError={(e) => { e.currentTarget.style.display = "none" }} />
            </div>
          )}
          <div className="flex-1 mt-3 md:mt-0">
            <h1 className="text-2xl md:text-4xl font-medium text-white mb-1 leading-tight">{branch.branchName}</h1>
            <div className="flex flex-wrap gap-x-2 mt-0 text-lg md:text-white/80">
              {branch.specialization?.slice(0, 3).map((spec: any) => <span key={spec._id}>{spec.name} Speciality</span>)}
              {branch.specialization?.length > 3 && <span className="text-white/60">+{branch.specialization.length - 3} more</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap md:ml-5 gap-3 mt-2">
          {branch.address && (
            <span className="flex items-center gap-2 text-lg md:text-sm md:text-white/90">
              <div className="md:w-4 md:block hidden w-5 h-5 md:h-4"><MapPin className="md:w-4 w-8 h-8 md:h-4" /></div>
              <div className="md:ml-2">{branch.address}</div>
            </span>
          )}
          {branch.emergencyContact && (
            <span className="flex items-center gap-2 text-sm text-red-300">
              <Phone className="w-4 h-4" /> Emergency: {branch.emergencyContact}
            </span>
          )}
        </div>
      </div>
    </div>
  </section>
)

export default HeroSection
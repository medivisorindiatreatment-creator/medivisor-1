"use client"

import { useState, useEffect, useMemo, use } from "react"
import ContactForm from "@/components/ContactForm"
import { Users, Heart } from "lucide-react"
import HeroSection from "./components/HeroSection"
import BranchCard from "./components/BranchCard"
import DoctorCard from "./components/DoctorCard"
import TreatmentCard from "./components/TreatmentCard"
import EmblaCarousel from "./components/EmblaCarousel"
import Breadcrumb from "./components/Breadcrumb"
import RichTextDisplay from "./components/RichTextDisplay"
import BranchesSection from "./components/BranchesSection"
import HospitalDetailSkeleton from "./components/HospitalDetailSkeleton"
import ErrorState from "./components/ErrorState"
import SimilarHospitalsSection from "./components/SimilarHospitalsSection"
import { getHospitalCity } from "./utils"
import type { HospitalWithBranchPreview, HospitalWithBranchPreviewExtended, AccreditationType, HospitalApiResponse } from "./types"



// ==============================
// MAIN COMPONENT
// ==============================

export default function HospitalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [hospital, setHospital] = useState<HospitalWithBranchPreviewExtended | null>(null)
  const [similarHospitals, setSimilarHospitals] = useState<HospitalWithBranchPreviewExtended[]>([])
  const [allHospitals, setAllHospitals] = useState<HospitalWithBranchPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllBranches, setShowAllBranches] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')

  const hospitalSlugFromParams = resolvedParams.slug

  useEffect(() => {
    const fetchHospitalData = async () => {
      setLoading(true)
      setError(null)
      try {
        const specificRes = await fetch(`/api/hospitals?slug=${hospitalSlugFromParams}`)
        if (!specificRes.ok) throw new Error("Failed to fetch hospital details")
        const specificData: HospitalApiResponse = await specificRes.json()
        if (!specificData.items?.length) throw new Error("Hospital not found")
        const matchedHospital = specificData.items[0]

        const allRes = await fetch('/api/hospitals?pageSize=50')
        if (!allRes.ok) throw new Error("Failed to fetch all hospitals")
        const allData: HospitalApiResponse = await allRes.json()
        const hospitalsForSearch = allData.items || []
        setAllHospitals(hospitalsForSearch)

        const hospitalCity = getHospitalCity(matchedHospital)
        const hospitalWithCity: HospitalWithBranchPreviewExtended = { ...matchedHospital, city: hospitalCity }
        setHospital(hospitalWithCity)

        const hospitalsWithCity: HospitalWithBranchPreviewExtended[] = hospitalsForSearch.map((h: HospitalWithBranchPreview) => ({ ...h, city: getHospitalCity(h) }))

        const similar = hospitalsWithCity
          .filter((h) => h._id !== matchedHospital._id && (
            h.city === hospitalCity ||
            h.accreditations?.some((acc: AccreditationType) => hospitalWithCity.accreditations?.some((mAcc: AccreditationType) => mAcc.title === acc.title))
          ))
          .slice(0, 6)
        setSimilarHospitals(similar)

      } catch (err) {
        try {
          const allRes = await fetch('/api/hospitals?pageSize=50')
          if (allRes.ok) {
            const allData = await allRes.json()
            setAllHospitals(allData.items || [])
          }
        } catch {}
        setError(err instanceof Error ? err.message : "Failed to load hospital details")
      } finally {
        setLoading(false)
      }
    }
    fetchHospitalData()
  }, [hospitalSlugFromParams])

  const allCityOptions = useMemo(() => {
    if (!hospital?.branches) return []
    const cities = new Set<string>()
    hospital.branches.forEach((branch) => {
      const city = branch.city?.[0]?.name || branch.city?.[0]?.cityName
      if (city) cities.add(city)
    })
    return Array.from(cities)
  }, [hospital])

  const filteredBranches = useMemo(() => {
    if (!hospital?.branches) return []
    return hospital.branches.filter(branch => {
      const branchCity = branch.city?.[0]?.name || branch.city?.[0]?.cityName || ''
      const matchesCity = !selectedCity || branchCity === selectedCity
      return matchesCity
    })
  }, [hospital, selectedCity])

  const visibleBranches = showAllBranches ? filteredBranches : filteredBranches.slice(0, 3)

  const rawDescription = hospital?.description || null

  const allDoctors = hospital?.branches?.flatMap(branch => (branch.doctors || []).map((doctor: any) => ({
    ...doctor,
    branch: branch.branchName
  }))) || []
  const allTreatments = hospital?.branches?.flatMap(branch => (branch.treatments || []).map((treatment: any) => ({
    ...treatment,
    branch: branch.branchName
  }))) || []

  const uniqueDoctors = allDoctors.filter((doctor, index, self) =>
    index === self.findIndex((d: any) => d._id === doctor._id)
  ).slice(0, 9)
  const uniqueTreatments = allTreatments.filter((treatment, index, self) =>
    index === self.findIndex((t: any) => t._id === treatment._id)
  ).slice(0, 9)

  const uniqueAccreditations = useMemo(() => {
    if (!hospital?.accreditations) return []
    const titlesSeen = new Set<string>()
    const unique: AccreditationType[] = []
    hospital.accreditations.forEach(acc => {
      if (!titlesSeen.has(acc.title)) {
        titlesSeen.add(acc.title)
        unique.push(acc)
      }
    })
    return unique
  }, [hospital])

  if (loading) return <HospitalDetailSkeleton />
  if (error || !hospital) return <ErrorState error={error} />

  return (
    <div className={`min-h-screen bg-gray-50 `}>
      <HeroSection hospital={hospital} accreditations={uniqueAccreditations} />
      <Breadcrumb
        hospitalName={hospital.hospitalName}
        hospitalSlug={hospitalSlugFromParams}
      />
      <section className="pt-8 pb-10 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <main className="lg:col-span-9 space-y-10 md:space-y-8">
              {rawDescription && (
                <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-8 shadow-md">
                  <RichTextDisplay
                    htmlContent={rawDescription}
                    className="mt-0"
                  />
                </section>
              )}
              {hospital.branches && hospital.branches.length > 0 && (
                <BranchesSection
                  hospital={hospital}
                  selectedCity={selectedCity}
                  allCityOptions={allCityOptions}
                  visibleBranches={visibleBranches}
                  filteredBranches={filteredBranches}
                  setShowAllBranches={setShowAllBranches}
                  showAllBranches={showAllBranches}
                  setSelectedCity={setSelectedCity}
                  hospitalSlug={hospitalSlugFromParams}
                />
              )}
              {uniqueDoctors.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-8 shadow-md">
                  <EmblaCarousel
                    items={uniqueDoctors}
                    title="Featured Specialist Doctors"
                    icon={Users}
                    type="doctors"
                  />
                </section>
              )}
              {uniqueTreatments.length > 0 && (
                <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-8 shadow-md">
                  <EmblaCarousel
                    items={uniqueTreatments}
                    title="Popular Treatments & Procedures"
                    icon={Heart}
                    type="treatments"
                  />
                </section>
              )}
              {similarHospitals.length > 0 && (
                <SimilarHospitalsSection similarHospitals={similarHospitals} />
              )}
            </main>
            <aside className="lg:col-span-3 space-y-10 mt-10 lg:mt-0">
              <div className="lg:sticky lg:top-16">
                <ContactForm />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
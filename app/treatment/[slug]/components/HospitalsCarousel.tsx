"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import classNames from "classnames"
import type { HospitalTreatmentInfo } from "../utils"
import BranchCard from "./BranchCard"

interface HospitalsCarouselProps {
  title: string
  hospitals: HospitalTreatmentInfo[]
  totalHospitals: number
}

export default function HospitalsCarousel({ title, hospitals, totalHospitals }: HospitalsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: false,
    containScroll: "keepSnaps"
  })
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  // Collect all branches from all hospitals
  const allBranches = useMemo(() => {
    const branches: Array<{
      branchInfo: HospitalTreatmentInfo["branches"][0]
      hospital: HospitalTreatmentInfo["hospital"]
    }> = []

    hospitals.forEach((hospitalWrapper) => {
      hospitalWrapper.branches.forEach((branchInfo) => {
        branches.push({
          branchInfo,
          hospital: hospitalWrapper.hospital
        })
      })
    })

    return branches
  }, [hospitals])

  if (allBranches.length === 0) return null

  return (
    <section className="bg-white rounded-sm border border-gray-100 p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h3 className="text-xl font-medium text-gray-900">
         Related Hospitals
        </h3>
      </div>

      <div className="relative" role="region" aria-label="Hospitals Carousel">
        <div className="embla__viewport overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex touch-pan-y ml-[-1rem]">
            {allBranches.map((item, index) => (
              <div
                key={`${item.branchInfo.branch._id}-${index}`}
                className="embla__slide flex-[0_0_auto] min-w-0 w-full md:w-[calc(33.333%-0.666rem)] pl-4"
              >
                <BranchCard
                  branch={item.branchInfo.branch}
                  hospital={item.hospital}
                  treatmentCost={item.branchInfo.treatmentCost}
                  treatmentDuration={item.branchInfo.treatmentDuration}
                  matchingDoctorsCount={item.branchInfo.matchingDoctors?.length}
                />
              </div>
            ))}
          </div>
        </div>

        {allBranches.length > 1 && (
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between pointer-events-none px-2">
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className={classNames(
                "pointer-events-auto p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-[#74BF44] transition-all disabled:opacity-40 disabled:cursor-not-allowed ml-[-1rem]"
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className={classNames(
                "pointer-events-auto p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-[#74BF44] transition-all disabled:opacity-40 disabled:cursor-not-allowed mr-[-1rem]"
              )}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

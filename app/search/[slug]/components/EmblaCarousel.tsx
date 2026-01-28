"use client"

import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Users, Heart, Hospital } from "lucide-react"
import DoctorCard from "./DoctorCard"
import TreatmentCard from "./TreatmentCard"
import SimilarHospitalCard from "./SimilarHospitalCard"
import CarouselControls from "./CarouselControls"

const EmblaCarousel = ({ items, title, icon: Icon, type }: { items: any[], title: string, icon: any, type: 'doctors' | 'treatments' | 'hospitals' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const visibleSlidesClass = 'flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]'

  const renderCard = (item: any) => {
    switch (type) {
      case 'doctors': return <DoctorCard doctor={item} />
      case 'treatments': return <TreatmentCard treatment={item} />
      case 'hospitals': return <SimilarHospitalCard hospital={item} />
      default: return null
    }
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-medium text-gray-900 flex items-center gap-3`}>
          <Icon className="w-6 h-6 text-gray-600" />
          {title}
        </h3>
        <CarouselControls onPrev={scrollPrev} onNext={scrollNext} show={items.length > 3} />
      </div>
      <div className="overflow-hidden -mx-2" ref={emblaRef}>
        <div className="flex gap-6">
          {items.map((item, index) => (
            <div key={item._id || index} className={visibleSlidesClass}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
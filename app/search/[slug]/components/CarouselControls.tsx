"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

const CarouselControls = ({ onPrev, onNext, show }: { onPrev: () => void; onNext: () => void; show: boolean }) => {
  const controlClass = "p-2 border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-600 hover:text-white transition-colors shadow-md hidden md:block z-10 disabled:opacity-50"
  if (!show) return null
  return (
    <div className="flex gap-3">
      <button onClick={onPrev} className={controlClass} aria-label="Previous slide">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={onNext} className={controlClass} aria-label="Next slide">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default CarouselControls
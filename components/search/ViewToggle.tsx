"use client"

import React from "react"
import type { FilterState } from '@/types/search'

type ViewToggleProps = {
  view: FilterState['view']
  setView: (view: FilterState['view']) => void
}

const ViewToggle = ({ view, setView }: ViewToggleProps) => (
  <div className="flex md:mt-0 mt-4 w-full md:w-auto bg-white  rounded-xs shadow-xs mx-auto lg:mx-0 md:max-w-md ">
    <button
      onClick={() => setView("hospitals")}
      className={`flex-1 px-4 py-2  rounded-xs text-base md:text-sm font-medium transition-all duration-200 ${view === "hospitals" ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-25"
        }`}
    >
      Hospitals
    </button>
    <button
      onClick={() => setView("doctors")}
      className={`flex-1 px-4 py-2  rounded-xs text-base md:text-sm font-medium transition-all duration-200 ${view === "doctors" ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-25"
        }`}
    >
      Doctors
    </button>
    <button
      onClick={() => setView("treatments")}
      className={`flex-1 px-4 py-2  rounded-xs text-base md:text-sm font-medium transition-all duration-200 ${view === "treatments" ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-25"
        }`}
    >
      Treatments
    </button>
  </div>
)

export default ViewToggle
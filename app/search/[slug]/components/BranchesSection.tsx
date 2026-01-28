"use client"

import { useState } from "react"
import { Building2, ChevronDown, ChevronUp } from "lucide-react"
import BranchCard from "./BranchCard"

const BranchesSection = ({ hospital, selectedCity, allCityOptions, visibleBranches, filteredBranches, setShowAllBranches, showAllBranches, setSelectedCity, hospitalSlug }: { hospital: any, selectedCity: string, allCityOptions: string[], visibleBranches: any[], filteredBranches: any[], setShowAllBranches: (val: boolean) => void, showAllBranches: boolean, setSelectedCity: (city: string) => void, hospitalSlug: string }) => {
  if (!hospital.branches || hospital.branches.length === 0) return null

  return (
    <section className="space-y-4 bg-white rounded-xl border border-gray-100 p-4 md:p-8 shadow-md">
      <div className="flex flex-wrap justify-between items-center gap-x-4">
        <h2 className={`text-2xl font-medium text-gray-900 flex items-center gap-3`}>
          <Building2 className="w-6 h-6 text-gray-600" />
           Branches
        </h2>

        {allCityOptions.length > 1 && (
          <div className="w-full sm:w-auto relative">
            <label htmlFor="city-filter" className="sr-only">Filter by City</label>
            <select
              id="city-filter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={`w-full sm:w-48 p-2 border border-gray-300 rounded-xs shadow-xs text-sm font-medium bg-white focus:ring-gray-500 focus:border-gray-500 transition-colors appearance-none pr-8`}
            >
              <option value="">All Cities</option>
              {allCityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:pt-0 pt-4">
        {visibleBranches.map(branch => (
          <div key={branch._id} className="h-full">
            <BranchCard branch={branch} hospitalSlug={hospitalSlug} />
          </div>
        ))}
      </div>

      {filteredBranches.length > 3 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAllBranches(!showAllBranches)}
            className={`text-gray-700 font-medium text-md hover:text-gray-800 transition-colors flex items-center gap-2 px-6 py-2 rounded-xs border border-gray-200 bg-gray-50 hover:bg-gray-100 shadow-sm`}
            aria-expanded={showAllBranches}
            aria-controls="hospital-branches"
          >
            {showAllBranches ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Show Less Branches
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                Show All {filteredBranches.length} Branches
              </>
            )}
          </button>
        </div>
      )}
    </section>
  )
}

export default BranchesSection
"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Filter, X } from "lucide-react"
import type { FilterKey, FilterState, OptionType } from '@/types/search'
import FilterDropdown from './FilterDropdown'

type AvailableOptions = {
  city: OptionType[]
  state: OptionType[]
  treatment: OptionType[]
  specialization: OptionType[]
  department: OptionType[]
  doctor: OptionType[]
  branch: OptionType[]
  location: OptionType[]
}

type FilterSidebarProps = {
  filters: FilterState
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  clearFilters: () => void
  updateSubFilter: (key: FilterKey, subKey: "id" | "query", value: string) => void
  availableOptions: AvailableOptions
  getFilterValueDisplay: (filterKey: FilterKey, currentFilters: FilterState, currentAvailableOptions: AvailableOptions) => string | null
  filteredBranches: any[]
  filteredDoctors: any[]
  filteredTreatments: any[]
}

const FilterSidebar = ({
  filters,
  showFilters,
  setShowFilters,
  clearFilters,
  updateSubFilter,
  availableOptions,
  getFilterValueDisplay,
  filteredBranches,
  filteredDoctors,
  filteredTreatments
}: FilterSidebarProps) => {
  const filterOptions: { value: FilterKey, label: string, isPrimary: boolean }[] = useMemo(() => {
    switch (filters.view) {
      case "hospitals":
        return [
          { value: "branch", label: "Hospital", isPrimary: true },
          { value: "treatment", label: "Treatment", isPrimary: true },
        ]
      case "doctors":
        return [
          { value: "doctor", label: "Doctor", isPrimary: true },
          { value: "specialization", label: "Specialization", isPrimary: false },
          { value: "treatment", label: "Treatment", isPrimary: false },
          { value: "department", label: "Department", isPrimary: false },
        ]
      case "treatments":
        return [
          { value: "treatment", label: "Treatment", isPrimary: true },
        ]
      default:
        return []
    }
  }, [filters.view])

  const visibleFilterKeys = useMemo(() => ["branch", "treatment", "doctor", "specialization", "department"] as FilterKey[], [filters.view])
  const activeFilterKey = useMemo(() => {
    if (filters.view === 'hospitals') return 'Hospitals'
    if (filters.view === 'doctors') return 'Doctors'
    return 'Treatments'
  }, [filters.view])

  const hasAppliedFilters = useMemo(() =>
    filterOptions.some(opt => getFilterValueDisplay(opt.value, filters, availableOptions)) ||
    (filters.city.id || filters.city.query) ||
    (filters.state.id || filters.state.query),
    [filters, availableOptions, filterOptions, getFilterValueDisplay]
  )

  const shouldRenderFilter = useCallback((key: FilterKey): boolean => {
    const isPrimaryFilter = key === 'branch' || key === 'doctor' || key === 'treatment'
    const filter = filters[key]
    const options = availableOptions[key]

    if (filter.id || filter.query) return true
    if (!visibleFilterKeys.includes(key)) return false
    if (options.length === 0) return false

    if (isPrimaryFilter) {
      return options.length >= 2
    }

    if (options.length < 2) return false

    return true
  }, [filters, availableOptions, visibleFilterKeys])

  const cityValue = getFilterValueDisplay('city', filters, availableOptions)
  const stateValue = getFilterValueDisplay('state', filters, availableOptions)

  // Refs for auto-scroll
  const filterContentRef = useRef<HTMLDivElement>(null)
  const activeFilterRef = useRef<HTMLDivElement>(null)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const scrollTimeoutRef = useRef<number | null>(null)

  // Track keyboard visibility on mobile
  useEffect(() => {
    if (!showFilters) return

    const handleResize = () => {
      const visualViewport = window.visualViewport
      if (visualViewport) {
        const isKeyboardVisible = visualViewport.height < window.innerHeight * 0.7
        setKeyboardVisible(isKeyboardVisible)

        // Auto-scroll active input into view when keyboard opens
        if (isKeyboardVisible && activeFilterRef.current) {
          scrollToActiveFilter()
        }
      }
    }

    // Listen to visual viewport changes (keyboard open/close)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      }
    }
  }, [showFilters])

  // Scroll to active filter when it gains focus
  const scrollToActiveFilter = () => {
    if (!activeFilterRef.current || !filterContentRef.current) return

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

    scrollTimeoutRef.current = setTimeout(() => {
      const filterElement = activeFilterRef.current
      const container = filterContentRef.current

      if (filterElement && container) {
        const elementRect = filterElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // Calculate scroll position
        const scrollTop = container.scrollTop
        const elementTop = elementRect.top - containerRect.top + scrollTop
        const elementBottom = elementRect.bottom - containerRect.top + scrollTop

        // Scroll to position element at top (with some padding)
        const targetScroll = elementTop - 80 // 80px padding from top

        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        })
      }
    }, 100) as unknown as number // Small delay to ensure keyboard is fully opened
  }

  // Handle filter focus for auto-scroll
  const handleFilterFocus = (key: FilterKey, element: HTMLInputElement) => {
    // Store ref to active filter element
    activeFilterRef.current = element.closest('.filter-section') as HTMLDivElement
    scrollToActiveFilter()
  }

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFilters) {
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
          ; (document.activeElement as HTMLInputElement).blur()
        } else {
          setShowFilters(false)
        }
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showFilters, setShowFilters])

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:block sticky top-16 h-screen w-64 lg:w-72 flex-shrink-0 border-r border-gray-100 overflow-y-auto bg-gray-50`}>
        <div className=" h-full overflow-y-auto">
          <div className="flex justify-between items-center pt-6 px-4 bg-white mb-0 py-2 border-b border-gray-100 sticky top-0 z-10">
            <div className="flex items-center gap-1">
              <div className="p-1 rounded-lg bg-gray-50">
                <Filter className="w-4 h-4 text-gray-600" />
              </div>
              <h3 className="text-base font-medium text-gray-900">
                Filters
              </h3>
            </div>
            {hasAppliedFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors px-2 py-1 hover:bg-gray-50 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2 p-4">
            {filterOptions.map(opt => {
              const key = opt.value
              if (!shouldRenderFilter(key)) return null

              const filterLabel = key === 'specialization' && filters.view === 'doctors' ? 'Specialist' : opt.label

              return (
                <div key={key} className="space-y-1 filter-section">
                  <label className="text-sm font-medium text-gray-800 mb-2">
                    {filterLabel}
                  </label>
                  <FilterDropdown
                    placeholder={`Search ${filterLabel.toLowerCase()}`}
                    filterKey={key}
                    filters={filters}
                    updateSubFilter={updateSubFilter}
                    options={availableOptions[key]}
                    className="w-full"
                  // onFocus={handleFilterFocus} // Removed desktop onFocus
                  />
                </div>
              )
            })}

            {filterOptions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">Select a view to see filters</p>
              </div>
            )}
          </div>

          {hasAppliedFilters && (
            <div className="mt-8 pt-6 px-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Applied</h4>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                  {filterOptions.filter(opt => getFilterValueDisplay(opt.value, filters, availableOptions)).length + (cityValue ? 1 : 0) + (stateValue ? 1 : 0)}
                </span>
              </div>
              <div className="space-y-2">
                {filterOptions.map((opt) => {
                  const value = getFilterValueDisplay(opt.value, filters, availableOptions)
                  if (!value) return null

                  return (
                    <div key={opt.value} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs text-gray-500 truncate">{opt.label}</span>
                        <span className="text-sm text-gray-900 font-medium truncate">{value}</span>
                      </div>
                      <button
                        onClick={() => {
                          updateSubFilter(opt.value as FilterKey, "id", "")
                          updateSubFilter(opt.value as FilterKey, "query", "")
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )
                })}
                {cityValue && (
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs text-gray-500">City</span>
                      <span className="text-sm text-gray-900 font-medium truncate">{cityValue}</span>
                    </div>
                    <button
                      onClick={() => {
                        updateSubFilter('city', "id", "")
                        updateSubFilter('city', "query", "")
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {stateValue && (
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs text-gray-500">State</span>
                      <span className="text-sm text-gray-900 font-medium truncate">{stateValue}</span>
                    </div>
                    <button
                      onClick={() => {
                        updateSubFilter('state', "id", "")
                        updateSubFilter('state', "query", "")
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg safe-area-bottom">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setShowFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasAppliedFilters && (
              <span className="ml-1 w-2 h-2 bg-gray-500 rounded-full"></span>
            )}
          </button>

          <a
            href="https://wa.me/your-number"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Chat</span>
          </a>
        </div>
      </div>

      {/* Mobile Filter Sheet - Modern Design */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ease-out ${showFilters ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        {/* Backdrop with touch close */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showFilters ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setShowFilters(false)}
        />

        {/* Bottom Sheet - Adjust height when keyboard is visible */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out ${showFilters ? 'translate-y-0' : 'translate-y-full'
            }`}
          style={{
            maxHeight: keyboardVisible ? '70vh' : '92vh',
            height: keyboardVisible ? '70vh' : 'auto',
            touchAction: 'pan-y',
          }}
        >
          {/* Grab Handle */}
          <div className="sticky top-0 pt-3 pb-2 flex justify-center bg-white rounded-t-2xl z-30">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header - Sticky */}
          <div className="px-4 pb-4 border-b border-gray-100 sticky top-0 bg-white z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  <Filter className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeFilterKey} • {hasAppliedFilters ? 'Filtered' : 'All results'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Content - Scrollable with keyboard-aware scrolling */}
          <div
            ref={filterContentRef}
            className="px-4 py-4 overflow-y-auto overscroll-contain"
            style={{
              maxHeight: keyboardVisible ? 'calc(70vh - 140px)' : 'calc(92vh - 180px)',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              paddingBottom: keyboardVisible ? '20px' : '0'
            }}
          >
            <div className="space-y-6 pb-4">
              {/* Active Filters Chips - Auto-hide when keyboard is open */}
              {hasAppliedFilters && !keyboardVisible && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">Active Filters</h4>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map((opt) => {
                      const value = getFilterValueDisplay(opt.value, filters, availableOptions)
                      if (!value) return null

                      return (
                        <div
                          key={opt.value}
                          className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-2 rounded-full text-sm"
                        >
                          <span className="font-medium">{value}</span>
                          <button
                            onClick={() => {
                              updateSubFilter(opt.value as FilterKey, "id", "")
                              updateSubFilter(opt.value as FilterKey, "query", "")
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )
                    })}
                    {cityValue && (
                      <div className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-2 rounded-full text-sm">
                        <span className="font-medium">{cityValue}</span>
                        <button
                          onClick={() => {
                            updateSubFilter('city', "id", "")
                            updateSubFilter('city', "query", "")
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {stateValue && (
                      <div className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-2 rounded-full text-sm">
                        <span className="font-medium">{stateValue}</span>
                        <button
                          onClick={() => {
                            updateSubFilter('state', "id", "")
                            updateSubFilter('state', "query", "")
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Filter Inputs */}
              <div className="space-y-5">
                {filterOptions.map(opt => {
                  const key = opt.value
                  if (!shouldRenderFilter(key)) return null

                  const filterLabel = key === 'specialization' && filters.view === 'doctors' ? 'Specialist' : opt.label

                  return (
                    <div key={key} className="space-y-2 filter-section">
                      <label className="text-sm font-medium text-gray-900">
                        {filterLabel}
                      </label>
                      <div className="relative">
                        <FilterDropdown
                          placeholder={`Type to search ${filterLabel.toLowerCase()}...`}
                          filterKey={key}
                          filters={filters}
                          updateSubFilter={updateSubFilter}
                          options={availableOptions[key]}
                          mobile
                        // autoFocus={filterOptions.length === 1} // Removing autoFocus for accessibility
                        // onFocus={(element) => handleFilterFocus(key, element)} // Only required if custom focus logic is needed
                        />
                      </div>
                    </div>
                  )
                })}

                {filterOptions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400">No filters available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Hide when keyboard is open to save space */}
          {!keyboardVisible && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 safe-area-bottom z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    clearFilters()
                    setShowFilters(false)
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-600 text-white font-medium hover:bg-gray-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  View Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FilterSidebar
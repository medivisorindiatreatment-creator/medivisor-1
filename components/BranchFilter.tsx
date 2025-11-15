// File: components/BranchFilter.tsx (assuming this is the renamed or actual file for HospitalSearch)
"use client"
import { useState, useMemo, useCallback, useEffect, useRef } from "react" // FIXED: Added useEffect and useRef to imports
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import { Building2, MapPin, Stethoscope, Scissors, Users, Heart, X } from "lucide-react" // FIXED: Added X icon import
import classNames from "classnames"

// UPDATED: Extracted as separate component for "Find Your Hospital" side filter (renamed to BranchFilter if needed)

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

// UPDATED: Fixed SearchDropdown with useRef and useEffect for click outside
const SearchDropdown = ({ value, onChange, placeholder, options, selectedOption, onOptionSelect, onClear, type }: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { id: string; name: string }[]
  selectedOption: string | null
  onOptionSelect: (id: string) => void
  onClear: () => void
  type: "branch" | "city" | "treatment" | "doctor" | "specialty"
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null) // FIXED: Changed from useState to useRef
  const filteredOptions = useMemo(() => {
    if (!value) return options
    const lower = value.toLowerCase()
    return options.filter(option => option.name.toLowerCase().includes(lower))
  }, [value, options])

  // FIXED: Added useEffect for click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOptionName = options.find((opt) => opt.id === selectedOption)?.name || value

  const getIcon = () => {
    const icons = {
      branch: Building2,
      city: MapPin,
      default: Stethoscope
    }
    const Icon = icons[type as keyof typeof icons] || icons.default
    return <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  }

  const getNoResultsText = () => {
    const texts = {
      branch: "branches",
      city: "cities",
      treatment: "treatments",
      doctor: "doctors",
      specialty: "specializations"
    }
    return texts[type] || "options"
  }

  return (
    <div ref={dropdownRef} className="relative space-y-2"> {/* FIXED: Added ref to div */}
      <div className="relative">
     
        <input
          type="text"
          value={isOpen ? value : selectedOptionName}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-4 pr-4 py-2 border border-gray-200 text-sm rounded-xs focus:outline-none focus:ring-1 focus:ring-gray-400/50 bg-white text-gray-900 placeholder-gray-500 shadow-xs"
        />
        {(selectedOption || value) && (
          <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xs shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onOptionSelect(option.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  option.id === selectedOption ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 italic">No matching {getNoResultsText()} found.</div>
          )}
        </div>
      )}
    </div>
  )
}

// HospitalSearchTabs
const HospitalSearchTabs = ({ view, setView }: { view: 'hospital' | 'doctors' | 'treatments'; setView: (view: 'hospital' | 'doctors' | 'treatments') => void }) => (
  <div className="flex bg-gray-100/50 rounded-xs p-1 mb-3 shadow-xs">
    {['hospital', 'doctors', 'treatments'].map((tab) => (
      <button
        key={tab}
        onClick={() => setView(tab as any)}
        className={`flex-1 py-2.5 rounded-xs text-sm font-medium transition-colors ${
          view === tab ? 'bg-white shadow-sm text-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
)

// Main BranchFilter Component (formerly HospitalSearch) - UPDATED: Enhanced branches handling with better filtering and full branch details
// UPDATED: Aligned treatment fetching logic with getAllExtendedTreatments from page.tsx: Include treatments from hospital.treatments, branch.treatments, and branch.specialists.treatments.
// Contextual filtering for branch/city selections now properly aggregates and dedupes treatments using Map by _id.
const BranchFilter = ({ allHospitals }: { allHospitals: any[] }) => { // RENAMED: To BranchFilter as per error file
  const router = useRouter()
  const [view, setView] = useState<'hospital' | 'doctors' | 'treatments'>('hospital')
  const [branchQuery, setBranchQuery] = useState("")
  const [cityQuery, setCityQuery] = useState("")
  const [treatmentQuery, setTreatmentQuery] = useState("")
  const [doctorQuery, setDoctorQuery] = useState("")
  const [specializationQuery, setSpecializationQuery] = useState("")
  const [selectedBranchId, setSelectedBranchId] = useState("")
  const [selectedCityId, setSelectedCityId] = useState("")
  const [selectedTreatmentId, setSelectedTreatmentId] = useState("")
  const [selectedDoctorId, setSelectedDoctorId] = useState("")
  const [selectedSpecializationId, setSelectedSpecializationId] = useState("")

  const generateSlug = (name: string | null | undefined): string => {
    if (!name || typeof name !== 'string') return ''
    return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
  }

  const getFilteredBranches = useMemo(() => {
    let filteredHospitals = allHospitals.filter(h => h?.branches)
    let branches = filteredHospitals.flatMap((h: any) =>
      h.branches.filter((b: any) => b?.branchName).map((b: any) => ({ b, h }))
    )
    if (selectedCityId) {
      branches = branches.filter(({ b }) => b.city?.some((c: any) => c?._id === selectedCityId))
    }
    if (selectedBranchId) {
      branches = branches.filter(({ b }) => b._id === selectedBranchId)
    }
    // UPDATED: Enhanced filtering for branches - now only by branch name since hospital is separate
    if (branchQuery) {
      branches = branches.filter(({ b }) => 
        b.branchName.toLowerCase().includes(branchQuery.toLowerCase())
      )
    }
    return branches
  }, [allHospitals, selectedCityId, selectedBranchId, branchQuery])

  // UPDATED: Enhanced branch options with full details including address and facilities count for better display
  // But display only branch name as per request. Now filters by selectedCityId for relevance.
  const availableBranchOptions = useMemo(() => {
    let branches = allHospitals.flatMap((h: any) =>
      h.branches.filter((b: any) => b?.branchName).map((b: any) => ({ b, h: h.hospitalName }))
    )
    if (selectedCityId) {
      branches = branches.filter(({ b }) => b.city?.some((c: any) => c?._id === selectedCityId))
    }
    const branchMap = new Map<string, { name: string; details: string }>()
    branches.forEach(({ b, h }) => {
      if (b?._id && b.branchName && h) {
        const cityName = b.city?.[0]?.cityName || ''
        const addressSnippet = b.address ? ` - ${b.address.substring(0, 30)}...` : ''
        const facilitiesCount = b.facilities?.length || 0
        const displayName = `${b.branchName}` // UPDATED: Display only branch name
        const details = `${h} - ${b.branchName} in ${cityName}${addressSnippet} (${facilitiesCount} facilities)`
        branchMap.set(b._id, { name: displayName, details })
      }
    })
    return Array.from(branchMap.entries()).map(([id, data]) => ({ id, name: data.name, details: data.details })) // UPDATED: Added details for richer options
  }, [allHospitals, selectedCityId])

  const availableCityOptions = useMemo(() => {
    // UPDATED: Compute relevant branches based on branch selection, independent of city filter
    let relevantBranches = selectedBranchId 
      ? allHospitals.flatMap((h: any) => h.branches.filter((b: any) => b._id === selectedBranchId)).filter(Boolean)
      : allHospitals.flatMap((h: any) => h.branches || [])
    let cities = relevantBranches.flatMap((b: any) => b.city || []).map((c: any) => ({ c }))
    const cityMap = new Map<string, string>()
    cities.forEach(({ c }) => {
      if (c?._id && c.cityName) cityMap.set(c._id, c.cityName)
    })
    return Array.from(cityMap.entries()).map(([id, name]) => ({ id, name }))
  }, [allHospitals, selectedBranchId])

  // UPDATED: Aligned with getAllExtendedTreatments logic: Aggregate from h.treatments, b.treatments, and b.specialists.treatments.
  // Dedupe by _id using Map. Contextual: if branch selected, from that branch (incl. specialists); if city, from city branches; else all.
  const availableTreatmentOptions = useMemo(() => {
    let treatments: any[] = []
    if (selectedBranchId) {
      const selectedBranch = allHospitals.flatMap(h => h.branches).find(b => b._id === selectedBranchId)
      if (selectedBranch) {
        treatments = [
          ...(selectedBranch.treatments || []),
          ...(selectedBranch.specialists || []).flatMap((s: any) => s.treatments || [])
        ]
      }
    } else if (selectedCityId) {
      const cityBranches = allHospitals.flatMap(h => h.branches.filter(b => b.city.some(c => c._id === selectedCityId)))
      treatments = cityBranches.flatMap((b: any) => [
        ...(b.treatments || []),
        ...(b.specialists || []).flatMap((s: any) => s.treatments || [])
      ])
    } else {
      allHospitals.forEach((h: any) => {
        // Hospital level treatments
        treatments.push(...(h.treatments || []))
        // Branch level treatments including specialists
        h.branches.forEach((b: any) => {
          treatments.push(...(b.treatments || []))
          treatments.push(...(b.specialists || []).flatMap((s: any) => s.treatments || []))
        })
      })
    }
    const treatMap = new Map<string, string>()
    treatments.filter(t => t?.name).forEach((t: any) => {
      if (t?._id && t.name) treatMap.set(t._id, t.name)
    })
    return Array.from(treatMap.entries()).map(([id, name]) => ({ id, name }))
  }, [allHospitals, selectedBranchId, selectedCityId])

  // UPDATED: Fixed doctor options to always fetch from all for proper display
  // Now contextual: if branch selected, only from that branch; if city, from city branches; else all.
  // Aligned with getAllExtendedDoctors: Aggregate from h.doctors and b.doctors, dedupe by _id.
  const availableDoctorOptions = useMemo(() => {
    let doctors: any[] = []
    if (selectedBranchId) {
      const selectedBranch = allHospitals.flatMap(h => h.branches).find(b => b._id === selectedBranchId)
      if (selectedBranch) {
        // Include hospital doctors if branch is under hospital, but primarily branch doctors
        const hospital = allHospitals.find(h => h.branches.some(b => b._id === selectedBranchId))
        if (hospital) {
          doctors = [...(hospital.doctors || []), ...(selectedBranch.doctors || [])]
        } else {
          doctors = selectedBranch.doctors || []
        }
      }
    } else if (selectedCityId) {
      const cityBranches = allHospitals.flatMap(h => h.branches.filter(b => b.city.some(c => c._id === selectedCityId)))
      cityBranches.forEach((b: any) => {
        const hospital = allHospitals.find(h => h.branches.some(hb => hb._id === b._id))
        if (hospital) {
          doctors.push(...(hospital.doctors || []), ...(b.doctors || []))
        } else {
          doctors.push(...(b.doctors || []))
        }
      })
    } else {
      allHospitals.forEach((h: any) => {
        doctors.push(...(h.doctors || []))
        h.branches.forEach((b: any) => {
          doctors.push(...(b.doctors || []))
        })
      })
    }
    const docMap = new Map<string, string>()
    doctors.filter(d => d?.doctorName).forEach((d: any) => {
      if (d?._id && d.doctorName) docMap.set(d._id, d.doctorName)
    })
    return Array.from(docMap.entries()).map(([id, name]) => ({ id, name }))
  }, [allHospitals, selectedBranchId, selectedCityId])

  // UPDATED: Fixed specialization options to always fetch from all for proper display
  // Now contextual: based on doctors in selected branch/city.
  // Extract from doctor.specialization, handling array/string.
  const availableSpecializationOptions = useMemo(() => {
    let specDoctors: any[] = []
    if (selectedBranchId) {
      const selectedBranch = allHospitals.flatMap(h => h.branches).find(b => b._id === selectedBranchId)
      if (selectedBranch) {
        const hospital = allHospitals.find(h => h.branches.some(b => b._id === selectedBranchId))
        specDoctors = hospital ? [...(hospital.doctors || []), ...(selectedBranch.doctors || [])] : selectedBranch.doctors || []
      }
    } else if (selectedCityId) {
      const cityBranches = allHospitals.flatMap(h => h.branches.filter(b => b.city.some(c => c._id === selectedCityId)))
      cityBranches.forEach((b: any) => {
        const hospital = allHospitals.find(h => h.branches.some(hb => hb._id === b._id))
        const branchDoctors = hospital ? [...(hospital.doctors || []), ...(b.doctors || [])] : b.doctors || []
        specDoctors.push(...branchDoctors)
      })
    } else {
      specDoctors = allHospitals.flatMap((h: any) => [...(h.doctors || []), ...(h.branches || []).flatMap((b: any) => b.doctors || [])])
    }
    const specMap = new Map<string, string>()
    specDoctors.filter(d => d?.doctorName).forEach((d: any) => {
      const specs = d?.specialization
      if (Array.isArray(specs)) {
        specs.forEach((spec: any) => {
          const id = spec?._id || (typeof spec === 'string' ? spec : '')
          const name = spec?.name || (typeof spec === 'string' ? spec : '')
          if (id && name) specMap.set(id, name)
        })
      } else if (specs && typeof specs === 'string') {
        specMap.set(specs, specs)
      }
    })
    return Array.from(specMap.entries()).map(([id, name]) => ({ id, name }))
  }, [allHospitals, selectedBranchId, selectedCityId])

  const handleSelect = useCallback((id: string, setterQuery: (name: string) => void, setterSelected: (id: string) => void, options: any[], type: string) => {
    const option = options.find(o => o.id === id)
    if (option) {
      setterSelected(id)
      // NOTE: We set the query to the FULL display name from the dropdown. 
      // This is crucial for matching the user's expectation from the dropdown visualization.
      setterQuery(option.name) 
      if (type === 'city' && selectedBranchId && !getFilteredBranches.find(({ b }) => b._id === selectedBranchId)) {
        setSelectedBranchId("")
        setBranchQuery("")
      }
    }
  }, [getFilteredBranches, selectedBranchId])

  const handleBranchSelect = useCallback((id: string) => {
    // Find the branch from the comprehensive list derived from allHospitals - UPDATED: Enhanced for full branches with error handling
    const selected = allHospitals.flatMap(h => h.branches?.map((b: any) => ({b, h})) || []).find(({ b }) => b._id === id)
    if (selected && selected.h && selected.b) { // FIXED: Added safety checks
      const fullSlug = `${generateSlug(selected.h.hospitalName)}-${generateSlug(selected.b.branchName)}`
      router.push(`/hospitals/branches/${fullSlug}`)
    }
  }, [allHospitals, router])

  const handleCitySelect = useCallback((id: string) => handleSelect(id, setCityQuery, setSelectedCityId, availableCityOptions, 'city'), [handleSelect, availableCityOptions])

  const handleTreatmentSelect = useCallback((id: string) => {
    const option = availableTreatmentOptions.find(o => o.id === id)
    if (option) {
      const treatmentSlug = generateSlug(option.name)
      router.push(`/treatment/${treatmentSlug}`)
    }
  }, [availableTreatmentOptions, router])

  const handleDoctorSelect = useCallback((id: string) => {
    const option = availableDoctorOptions.find(o => o.id === id)
    if (option) {
      const doctorSlug = generateSlug(option.name)
      router.push(`/doctors/${doctorSlug}`)
    }
  }, [availableDoctorOptions, router])

  const handleSpecializationSelect = useCallback((id: string) => handleSelect(id, setSpecializationQuery, setSelectedSpecializationId, availableSpecializationOptions, 'specialty'), [handleSelect, availableSpecializationOptions])

  // FIXED: Now useEffect is properly imported
  // Clear invalid selections (consolidated)
  useEffect(() => {
    const selectors = [
      { selected: selectedBranchId, options: availableBranchOptions, setters: [setSelectedBranchId, setBranchQuery] },
      { selected: selectedCityId, options: availableCityOptions, setters: [setSelectedCityId, setCityQuery] },
      { selected: selectedTreatmentId, options: availableTreatmentOptions, setters: [setSelectedTreatmentId, setTreatmentQuery] },
      { selected: selectedDoctorId, options: availableDoctorOptions, setters: [setSelectedDoctorId, setDoctorQuery] },
      { selected: selectedSpecializationId, options: availableSpecializationOptions, setters: [setSelectedSpecializationId, setSpecializationQuery] }
    ]
    selectors.forEach(({ selected, options, setters }) => {
      if (selected && !options.find(o => o.id === selected)) {
        setters.forEach(setter => setter(""))
      }
    })
  }, [availableBranchOptions, availableCityOptions, availableTreatmentOptions, availableDoctorOptions, availableSpecializationOptions, selectedBranchId, selectedCityId, selectedTreatmentId, selectedDoctorId, selectedSpecializationId])

  // UPDATED: Add logic for tab change to clear irrelevant fields and adjust options
  useEffect(() => {
    if (view === 'hospital') {
      // Clear doctor and specialization fields
      setDoctorQuery(""); setSpecializationQuery("")
      setSelectedDoctorId(""); setSelectedSpecializationId("")
      // Keep branch, city, treatment
    } else if (view === 'doctors') {
      // Clear treatment field
      setTreatmentQuery(""); setSelectedTreatmentId("")
      // Keep doctors and specializations
    } else if (view === 'treatments') {
      // Clear doctor and specialization fields
      setDoctorQuery(""); setSpecializationQuery("")
      setSelectedDoctorId(""); setSelectedSpecializationId("")
      // Keep treatment, branch, city
    }
  }, [view])

  const clearFilters = () => {
    setBranchQuery(""); setCityQuery(""); setTreatmentQuery(""); setDoctorQuery(""); setSpecializationQuery("")
    setSelectedBranchId(""); setSelectedCityId(""); setSelectedTreatmentId(""); setSelectedDoctorId(""); setSelectedSpecializationId("")
    setView('hospital')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let url = '/hospitals?'
    let params: string[] = []
    if (view !== 'hospital') params.push(`view=${view}`)
    if (branchQuery) params.push(`branch=${encodeURIComponent(branchQuery)}`)
    if (cityQuery) params.push(`city=${encodeURIComponent(cityQuery)}`)
    if (treatmentQuery) params.push(`treatment=${encodeURIComponent(treatmentQuery)}`)
    if (view === 'doctors') {
      if (doctorQuery) params.push(`doctor=${encodeURIComponent(doctorQuery)}`)
      if (specializationQuery) params.push(`specialization=${encodeURIComponent(specializationQuery)}`)
    }
    // UPDATED: Enhanced submit for branches - add branch-specific params if needed
    if (selectedBranchId) {
      params.push(`selectedBranch=${selectedBranchId}`)
    }
    router.push(params.length > 0 ? url + params.join('&') : '/hospitals')
  }

  // UPDATED: Auto-arrange input switching logic based on tab
  const getFieldOrder = useCallback(() => {
    switch (view) {
      case 'hospital':
        return ['branch', 'city', 'treatment']
      case 'doctors':
        return ['doctor', 'specialization', 'branch', 'city']
      case 'treatments':
        return ['treatment', 'branch', 'city']
      default:
        return ['branch', 'city', 'treatment']
    }
  }, [view])

  const renderField = (field: string) => {
    switch (field) {
      case 'branch':
        return (
          <SearchDropdown
            key="branch"
            value={branchQuery}
            onChange={setBranchQuery}
            placeholder="Search by branch name..."
            options={availableBranchOptions.map(opt => ({ id: opt.id, name: opt.name }))} // UPDATED: Use name for display (only branch name)
            selectedOption={selectedBranchId}
            onOptionSelect={handleBranchSelect}
            onClear={() => { setBranchQuery(""); setSelectedBranchId(""); }}
            type="branch"
          />
        )
      case 'city':
        return (
          <SearchDropdown
            key="city"
            value={cityQuery}
            onChange={setCityQuery}
            placeholder="Search by city..."
            options={availableCityOptions}
            selectedOption={selectedCityId}
            onOptionSelect={handleCitySelect}
            onClear={() => { setCityQuery(""); setSelectedCityId(""); }}
            type="city"
          />
        )
      case 'treatment':
        return view !== 'doctors' && (
          <SearchDropdown
            key="treatment"
            value={treatmentQuery}
            onChange={setTreatmentQuery}
            placeholder="Search treatments..."
            options={availableTreatmentOptions}
            selectedOption={selectedTreatmentId}
            onOptionSelect={handleTreatmentSelect}
            onClear={() => { setTreatmentQuery(""); setSelectedTreatmentId(""); }}
            type="treatment"
          />
        )
      case 'doctor':
        return view === 'doctors' && (
          <SearchDropdown
            key="doctor"
            value={doctorQuery}
            onChange={setDoctorQuery}
            placeholder="Search doctors by name..."
            options={availableDoctorOptions}
            selectedOption={selectedDoctorId}
            onOptionSelect={handleDoctorSelect}
            onClear={() => { setDoctorQuery(""); setSelectedDoctorId(""); }}
            type="doctor"
          />
        )
      case 'specialization':
        return view === 'doctors' && (
          <SearchDropdown
            key="specialization"
            value={specializationQuery}
            onChange={setSpecializationQuery}
            placeholder="Search specializations..."
            options={availableSpecializationOptions}
            selectedOption={selectedSpecializationId}
            onOptionSelect={handleSpecializationSelect}
            onClear={() => { setSpecializationQuery(""); setSelectedSpecializationId(""); }}
            type="specialty"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={`bg-white p-4 rounded-xs shadow-xs border border-gray-100 ${inter.variable} font-light`}>
      <h3 className="text-xl md:text-lg font-medium text-gray-900 tracking-tight mb-2">Find Your Hospital</h3>
      <HospitalSearchTabs view={view} setView={setView} />
      <form onSubmit={handleSubmit} className="space-y-2">
        {getFieldOrder().map(field => renderField(field))}
        <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-xs text-sm hover:bg-gray-800 transition-all font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-gray-400/50">
          Search & Redirect
        </button>
        <button type="button" onClick={clearFilters} className="w-full bg-gray-50/50 text-gray-600 py-2 rounded-xs text-sm hover:bg-gray-100 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-gray-400/50">
          Clear All Filters
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-3 text-center">Redirects to hospital directory with auto-filled filters</p>
    </div>
  )
}

export default BranchFilter
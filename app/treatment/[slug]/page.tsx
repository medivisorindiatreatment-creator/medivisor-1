// app/treatment/[slug]/page.tsx
// Dynamic page for individual treatment details.
// Enhanced for expert-level code quality: improved TypeScript types, component separation,
// optimized hooks (useMemo, useCallback), accessibility (ARIA labels, keyboard nav),
// Embla Carousel navigation wired up, consistent 3-card display across breakpoints,
// reduced redundancy in image utilities, better error handling, and cleaner structure.
// Color scheme: #241d1f text, #74BF44 accents, Inter font, rounded-sm, light shadows.
// Carousel: Fixed to display exactly 3 cards (responsive widths with calc(33.333% - 1rem gap)).
// Navigation arrows now functional with Embla API.
// SearchDropdown: Enhanced with keyboard navigation and ARIA.
// Data aggregation: Streamlined with reduced duplication.
// Skeletons: Optimized for performance.
// Fixed: Removed invalid top-level useCallback calls; moved pure functions to regular functions.
// Doctor card: Ensured branch name fetch with fallback to hospital name.
// UPDATED: Doctor card layout matches provided image: removed designation, department badges (up to 3), experience with green dot icon, hospital/branch name without icon.
// UPDATED: Removed sidebar (HospitalSearch and ContactForm) for full-width main content layout.
// FIXED: Added missing imports (ChevronDown, X, Search); cleaned SearchDropdown for used types only; removed unused allHospitals state and set.
// FIXED: Re-added allHospitals state to resolve ReferenceError in BranchesFilters usage.
// UPDATED: Integrated doctor mapping into treatment branches (per-branch specialist doctors for the treatment).
// Removed separate global doctor section; doctors now shown within each branch card (up to 3 per branch).
// Added total unique doctors count in hero for overview.
// Enhanced branch cards to display treatment-specific matching doctors.
// UPDATED: Added dedicated Doctors section with unique matching doctors across all branches offering the treatment (not limited to 6 branches for doctor collection).
// Doctors sorted by experience descending; displayed in responsive grid (3-4 cols); DoctorCard matches specified layout.

"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Image from "next/image"
import {
  Calendar,
  Award,
  Stethoscope,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Home,
  Hospital,
  MapPin,
  Bed,
  User,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  X,
  Search
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useEmblaCarousel from "embla-carousel-react"
import classNames from "classnames"
import { Inter } from "next/font/google"
import ContactForm from "@/components/ContactForm"
import BranchesFilters from "@/components/BranchFilter"
// Lightweight Inter font configuration
const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

// --- Types ---
interface City { _id: string; cityName: string; state: string | null; country: string | null }
interface Department { _id: string; name: string }
interface TreatmentLocation {
  branchId?: string
  branchName?: string
  hospitalName: string
  hospitalId: string
  cities: City[]
  departments: Department[]
  cost: string | null
}
interface Treatment {
  _id: string
  name: string
  description: string | null
  category: string | null
  duration: string | null
  cost: string | null
  treatmentImage?: string | null
  branchesAvailableAt: TreatmentLocation[]
  departments: Department[]
}
interface Doctor {
  _id: string
  doctorName: string
  specialization: any[]
  qualification: string | null
  experienceYears: string | null
  designation: string | null
  aboutDoctor: string | null
  profileImage: string | null
  locations: { hospitalName: string; hospitalId: string; branchName?: string; branchId?: string; cities: City[] }[]
  departments: Department[]
}
interface Branch {
  _id: string
  branchName: string
  address: string | null
  city: City[]
  totalBeds: string | null
  noOfDoctors: string | null
  yearEstablished: string | null
  branchImage: string | null
  description: string | null
  doctors: any[]
  treatments: any[]
  specialists: any[]
  specialization: any[]
  accreditation: any[]
  hospitalName: string
  hospitalId: string
  hospitalLogo: string | null
}
interface ExtendedBranch extends Branch {
  matchingDoctors: Doctor[]
}
interface Hospital {
  _id: string
  hospitalName: string
  logo: string | null
  yearEstablished: string | null
  description: string | null
  branches: Branch[]
  doctors: any[]
  treatments: any[]
  departments?: any[]
}
interface ApiResponse { items: Hospital[]; total: number }

// DoctorCard Props
interface DoctorCardProps {
  doctor: Doctor
}

// --- Utilities (Pure functions, no hooks) ---
const getWixImageUrl = (imageStr: string | null | undefined): string | null => {
  if (!imageStr || typeof imageStr !== "string" || !imageStr.startsWith("wix:image://v1/")) return null
  const parts = imageStr.split("/")
  return parts.length >= 4 ? `https://static.wixstatic.com/media/${parts[3]}` : null
}

const generateSlug = (name: string | null | undefined): string => {
  return (name ?? '').toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
}

const getContentImage = (content: any): string | null => {
  if (typeof content === 'string') return getWixImageUrl(content)
  if (!content || !content.nodes) return null
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    return `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`
  }
  return null
}

const getShortDescription = (richContent: any, maxLength: number = 100): string => {
  if (typeof richContent === 'string') {
    const text = richContent.replace(/<[^>]*>/g, '').trim()
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  if (!richContent || !richContent.nodes) return ''
  let text = ''
  for (const node of richContent.nodes) {
    if (node.type === 'PARAGRAPH' && text.length < maxLength) {
      const paraText = node.nodes?.map((n: any) => n.text || '').join(' ').trim()
      text += (text ? ' ' : '') + paraText
    }
    if (text.length >= maxLength) break
  }
  return text.trim().length > maxLength ? text.trim().substring(0, maxLength) + '...' : text.trim()
}

const renderRichText = (richContent: any): JSX.Element | null => {
  if (typeof richContent === 'string') {
    return <div className={`text-base text-[#241d1f] leading-relaxed prose prose-neutral space-y-3 prose-sm max-w-none font-extralight ${inter.variable}`} dangerouslySetInnerHTML={{ __html: richContent }} />
  }
  if (!richContent || !richContent.nodes) return null

  const renderNode = (node: any): JSX.Element | null => {
    switch (node.type) {
      case 'PARAGRAPH':
        return (
          <p key={Math.random()} className={`text-base text-[#241d1f] leading-relaxed mb-3 font-extralight ${inter.variable}`}>
            {node.nodes?.map((child: any, idx: number) => renderTextNode(child, idx))}
          </p>
        )
      case 'HEADING1':
        return (
          <h3 key={Math.random()} className={`text-xl font-normal text-[#241d1f] mb-3 leading-tight ${inter.variable}`}>
            {node.nodes?.map((child: any, idx: number) => renderTextNode(child, idx))}
          </h3>
        )
      case 'HEADING2':
        return (
          <h4 key={Math.random()} className={`text-lg font-normal text-[#241d1f] mb-3 leading-tight ${inter.variable}`}>
            {node.nodes?.map((child: any, idx: number) => renderTextNode(child, idx))}
          </h4>
        )
      case 'IMAGE':
        const imgSrc = getContentImage(node.imageData?.image?.src || node.imageData?.image)
        if (imgSrc) {
          return (
            <div key={Math.random()} className="my-6">
              <Image
                src={imgSrc}
                alt="Embedded image"
                width={600}
                height={400}
                className="w-full h-auto rounded-sm object-cover"
              />
            </div>
          )
        }
        return null
      default:
        return null
    }
  }

  const renderTextNode = (textNode: any, idx: number): JSX.Element | null => {
    if (textNode.type !== 'TEXT') return null
    const text = textNode.text || ''
    const isBold = textNode.textStyle?.bold || false
    const isItalic = textNode.textStyle?.italic || false
    const isUnderline = textNode.textStyle?.underline || false

    let content = text
    if (isBold) content = <strong key={idx}>{text}</strong>
    else if (isItalic) content = <em key={idx}>{text}</em>
    else if (isUnderline) content = <u key={idx}>{text}</u>
    else content = <span key={idx}>{text}</span>

    return content
  }

  return (
    <div className={`space-y-4 font-extralight ${inter.variable}`}>
      {richContent.nodes.map((node: any, idx: number) => renderNode(node))}
    </div>
  )
}

// Data Aggregation Functions (Pure)
const getAllExtendedTreatments = (hospitals: Hospital[]): Treatment[] => {
  const extended = new Map<string, Treatment>()
  hospitals.forEach((h) => {
    const processTreatment = (item: any, branch?: Branch, departments: Department[] = []) => {
      const baseId = item._id
      if (!extended.has(baseId)) {
        extended.set(baseId, {
          ...item,
          cost: item.cost ?? 'Price Varies',
          branchesAvailableAt: [],
          departments: [],
        } as Treatment)
      }
      const existingTreatment = extended.get(baseId)!
      const location: TreatmentLocation = {
        branchId: branch?._id,
        branchName: branch?.branchName,
        hospitalName: h.hospitalName,
        hospitalId: h._id,
        cities: branch?.city || [],
        departments: Array.from(new Map(departments.map(dept => [dept._id, dept])).values()),
        cost: item.cost,
      }
     
      const isLocationDuplicate = existingTreatment.branchesAvailableAt.some(
        loc => loc.hospitalId === h._id && (loc.branchId === branch?._id || (!loc.branchId && !branch?._id))
      )
     
      if (!isLocationDuplicate) {
        existingTreatment.branchesAvailableAt.push(location)
        const allDepts = [...existingTreatment.departments, ...departments]
        existingTreatment.departments = Array.from(new Map(allDepts.map(dept => [dept._id, dept])).values())
      }
    }
    // Hospital level treatments
    h.treatments?.forEach((item) => processTreatment(item))
    // Branch level treatments
    h.branches.forEach((b) => {
      const branchTreatments = [...(b.treatments || []), ...(b.specialists || []).flatMap(s => s.treatments || [])]
      branchTreatments.forEach((item) => {
        const treatmentDepartments: Department[] = []
        b.specialists?.forEach(spec => {
          const hasThisTreatment = spec.treatments?.some(t => t._id === item._id)
          if (hasThisTreatment && spec.department) treatmentDepartments.push(...spec.department)
        })
        processTreatment(item, b, treatmentDepartments)
      })
    })
  })
  return Array.from(extended.values())
}

const getAllExtendedDoctors = (hospitals: Hospital[]): Doctor[] => {
  const extendedMap = new Map<string, Doctor>()

  hospitals.forEach((h) => {
    const processDoctor = (item: any, branch?: Branch) => {
      const baseId = item._id
      
      const doctorDepartments: Department[] = []
      item.specialization?.forEach((spec: any) => {
        spec.department?.forEach((dept: Department) => {
          doctorDepartments.push(dept)
        })
      })
      const uniqueDepartments = Array.from(new Map(doctorDepartments.map(dept => [dept._id, dept])).values())

      const location = {
        hospitalName: h.hospitalName,
        hospitalId: h._id,
        branchName: branch?.branchName,
        branchId: branch?._id,
        cities: branch?.city || [],
      }

      if (extendedMap.has(baseId)) {
        const existingDoctor = extendedMap.get(baseId)!
        
        const isLocationDuplicate = existingDoctor.locations.some(
          loc => loc.hospitalId === h._id && (loc.branchId === branch?._id || (!loc.branchId && !branch?._id))
        )

        if (!isLocationDuplicate) {
          existingDoctor.locations.push(location)
        }
        
        const allDepts = [...existingDoctor.departments, ...uniqueDepartments]
        existingDoctor.departments = Array.from(new Map(allDepts.map(dept => [dept._id, dept])).values())

      } else {
        extendedMap.set(baseId, {
          ...item,
          locations: [location],
          departments: uniqueDepartments,
        } as Doctor)
      }
    }
    
    h.doctors.forEach((d) => processDoctor(d))

    h.branches.forEach((b) => {
      b.doctors.forEach((d) => processDoctor(d, b))
    })
  })

  return Array.from(extendedMap.values())
}

// --- Components ---
// DoctorCard Component (Matches specified layout: no designation, up to 3 dept badges, green dot for experience, hospital/branch without icon)
const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const profileImage = doctor.profileImage ? getWixImageUrl(doctor.profileImage) : null
  const primaryLocation = doctor.locations[0]
  const branchOrHospital = primaryLocation?.branchName 
    ? `${primaryLocation.hospitalName} - ${primaryLocation.branchName}` 
    : primaryLocation?.hospitalName || 'N/A'
  const departments = doctor.departments.slice(0, 3)

  return (
    <Link 
      href={`/doctor/${generateSlug(doctor.doctorName)}`} 
      className="block bg-white rounded-sm border border-gray-100 p-4 hover:shadow-sm transition-shadow w-full" 
      aria-label={`View profile of ${doctor.doctorName}`}
    >
      {profileImage ? (
        <Image
          src={profileImage}
          alt={doctor.doctorName}
          width={150}
          height={150}
          className="w-full h-32 object-cover rounded-sm mb-3"
        />
      ) : (
        <div className="w-full h-32 bg-gray-100 rounded-sm mb-3 flex items-center justify-center">
          <User className="w-12 h-12 text-gray-300" />
        </div>
      )}
      <h4 className={`text-base font-medium text-[#241d1f] mb-2 leading-tight ${inter.variable}`}>
        {doctor.doctorName}
      </h4>
      <div className="flex flex-wrap gap-1 mb-3">
        {departments.map((dept, idx) => (
          <span key={idx} className="text-xs bg-[#74BF44]/10 text-[#74BF44] px-2 py-1 rounded-full font-extralight">
            {dept.name}
          </span>
        ))}
      </div>
      {doctor.experienceYears && (
        <div className="flex items-center text-xs text-[#241d1f]/60 mb-2">
          <div className="w-1.5 h-1.5 bg-[#74BF44] rounded-full mr-1 flex-shrink-0"></div>
          <span>{doctor.experienceYears} years experience</span>
        </div>
      )}
      <div className={`text-xs text-[#241d1f]/60 font-extralight ${inter.variable}`}>
        {branchOrHospital}
      </div>
    </Link>
  )
}

// SearchDropdown Component (Enhanced with keyboard nav, cleaned for branch types only)
interface SearchDropdownProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { id: string; name: string }[]
  selectedOption: string
  onOptionSelect: (id: string) => void
  onClear: () => void
  type: "branch"
}

const SearchDropdown = ({ value, onChange, placeholder, options, selectedOption, onOptionSelect, onClear, type }: SearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const filteredOptions = useMemo(() => 
    options.filter(option => option.name.toLowerCase().includes(value.toLowerCase())),
  [options, value])

  const selectedOptionName = options.find(opt => opt.id === selectedOption)?.name || value

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && filteredOptions.length > 0) {
      setHighlightedIndex(0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [isOpen, filteredOptions.length])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          onOptionSelect(filteredOptions[highlightedIndex].id)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }, [isOpen, highlightedIndex, filteredOptions, onOptionSelect])

  const getIcon = () => {
    const icons = {
      branch: Hospital
    }
    const Icon = icons[type] || Search
    return <Icon className="w-4 h-4 text-[#241d1f]/60" />
  }

  const getPlaceholder = () => {
    const placeholders = {
      branch: "e.g., Max Hospital - Gurgaon..."
    }
    return placeholders[type] || placeholder
  }

  const getNoResultsText = () => {
    const texts = {
      branch: "branches"
    }
    return texts[type] || ""
  }

  return (
    <div ref={dropdownRef} className="relative space-y-2 w-full max-w-64">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{getIcon()}</div>
        <input
          ref={inputRef}
          type="text"
          placeholder={getPlaceholder()}
          value={selectedOptionName}
          onChange={(e) => {
            onChange(e.target.value)
            if (selectedOption) onOptionSelect("")
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`pl-10 pr-12 py-2.5 border border-gray-200 rounded-sm w-full text-sm bg-white focus:bg-white focus:ring-2 focus:ring-[#74BF44]/50 focus:border-[#74BF44]/50 transition-all placeholder:text-[#241d1f]/40 font-extralight ${inter.variable}`}
          aria-label={`Search ${getPlaceholder()}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {isOpen && (
          <ul role="listbox" className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-10 max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li key={option.id}>
                  <button
                    onClick={() => {
                      onOptionSelect(option.id)
                      setIsOpen(false)
                    }}
                    className={classNames(
                      "w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-[#241d1f] font-extralight",
                      { "bg-[#74BF44]/10": index === highlightedIndex }
                    )}
                    aria-selected={index === highlightedIndex}
                  >
                    {option.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">No {getNoResultsText()} found</li>
            )}
          </ul>
        )}
        {selectedOption && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#241d1f]/40 hover:text-[#241d1f]/70"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#241d1f]/40" />
      </div>
    </div>
  )
}

// Breadcrumb Component
const Breadcrumb = ({ treatmentName }: { treatmentName: string }) => (
  <nav className={`bg-white border-b border-gray-100 px-4 py-3 ${inter.variable} font-extralight`} aria-label="Breadcrumb">
    <div className="container mx-auto flex items-center space-x-2 text-sm text-[#241d1f]/70">
      <Link href="/" className="flex items-center hover:text-[#74BF44] transition-colors" aria-label="Home">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <ChevronRightIcon className="w-4 h-4" aria-hidden />
      <Link href="/treatment" className="hover:text-[#74BF44] transition-colors">
        Treatments
      </Link>
      <ChevronRightIcon className="w-4 h-4" aria-hidden />
      <span aria-current="page">{treatmentName}</span>
    </div>
  </nav>
)

// BranchesFilter Component
const BranchesFilter = ({ 
  branches, 
  onSearchChange, 
  onSelectBranch, 
  selectedBranchId, 
  searchValue 
}: { 
  branches: ExtendedBranch[], 
  onSearchChange: (value: string) => void, 
  onSelectBranch: (id: string) => void, 
  selectedBranchId: string, 
  searchValue: string 
}) => (
  <SearchDropdown
    value={searchValue}
    onChange={onSearchChange}
    placeholder="e.g., Max Hospital - Gurgaon..."
    options={branches.map(b => ({ id: b._id, name: `${b.hospitalName} - ${b.branchName} (${b.city[0]?.cityName})` }))}
    selectedOption={selectedBranchId}
    onOptionSelect={onSelectBranch}
    onClear={() => onSelectBranch("")}
    type="branch"
  />
)

// Generic Carousel Navigation Hook
const useCarouselNavigation = (emblaApi?: any) => {
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  return { scrollPrev, scrollNext }
}

// BranchesOfferingTreatmentCarousel Component (3 cards, wired nav, integrated treatment-specific doctors)
const BranchesOfferingTreatmentCarousel = ({ branches, treatmentName, emblaRef, emblaApi }: { branches: ExtendedBranch[], treatmentName: string, emblaRef: any, emblaApi?: any }) => {
  const { scrollPrev, scrollNext } = useCarouselNavigation(emblaApi)

  if (branches.length === 0) return null

  return (
    <div className={`relative bg-white rounded-sm border border-gray-100 p-4 shadow-xs overflow-hidden ${inter.variable} font-extralight`} role="region" aria-label="Branches Carousel">
      <div className="embla__viewport overflow-hidden h-auto" ref={emblaRef}>
        <div className="embla__container flex -ml-4">
          {branches.map((branch) => {
            const branchImage = branch.branchImage ? getContentImage(branch.branchImage) : null
            return (
              <div key={branch._id} className="embla__slide min-w-0 w-full md:w-[calc(33.333%-1rem)] flex-shrink-0 ml-4">
                <Link href={`/hospital/${generateSlug(branch.hospitalName)}/branch/${generateSlug(branch.branchName)}`} className="block bg-white rounded-sm border border-gray-100 p-4 hover:shadow-sm transition-shadow w-full" aria-label={`View ${branch.branchName} branch`}>
                  {branchImage ? (
                    <Image
                      src={branchImage}
                      alt={branch.branchName}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-sm mb-3"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-sm mb-3 flex items-center justify-center">
                      <Hospital className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <h4 className={`text-base font-medium text-[#241d1f] mb-2 leading-tight ${inter.variable}`}>
                    {branch.hospitalName} - {branch.branchName}
                  </h4>
                  <div className="flex items-center text-xs text-[#241d1f]/60 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{branch.city[0]?.cityName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {branch.specialization?.slice(0, 2).map((spec: any, idx: number) => (
                      <span key={idx} className="flex items-center text-xs text-[#74BF44]">
                        <span className="w-1.5 h-1.5 bg-[#74BF44] rounded-full mr-1"></span>
                        {spec.name}
                      </span>
                    ))}
                  </div>
                  {branch.matchingDoctors && branch.matchingDoctors.length > 0 && (
                    <div className="mb-3">
                      <p className={`text-xs text-[#241d1f]/70 uppercase tracking-wide mb-1 ${inter.variable}`}>Specialist Doctors for {treatmentName}</p>
                      <div className="flex flex-wrap gap-2">
                        {branch.matchingDoctors.slice(0, 3).map((doc: Doctor) => (
                          <Link
                            key={doc._id}
                            href={`/doctor/${generateSlug(doc.doctorName)}`}
                            className="text-xs text-[#74BF44] hover:underline font-medium"
                          >
                            {doc.doctorName.split(' ')[0]}
                          </Link>
                        ))}
                        {branch.matchingDoctors.length > 3 && (
                          <span className="text-xs text-gray-500">+{branch.matchingDoctors.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  {branch.totalBeds && (
                    <div className="flex items-center text-xs text-[#241d1f]/60">
                      <Bed className="w-3 h-3 mr-1" />
                      <span>{branch.totalBeds} beds</span>
                    </div>
                  )}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
      {branches.length > 3 && (
        <>
          <button 
            onClick={scrollPrev} 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md text-[#241d1f]/60 hover:text-[#241d1f] hover:bg-white transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={scrollNext} 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md text-[#241d1f]/60 hover:text-[#241d1f] hover:bg-white transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}

// Skeleton Components
const HeroSkeleton = () => (
  <section className="relative w-full h-[70vh] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full z-10 px-4 pb-12">
      <div className="container mx-auto space-y-4">
        <div className="space-y-2">
          <div className="h-8 md:h-10 bg-gray-300 rounded w-64 md:w-96" />
          <div className="h-5 bg-gray-300 rounded w-80" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-8 bg-gray-300 rounded-full w-32 px-4 py-2" />
          <div className="h-8 bg-gray-300 rounded-full w-40 px-4 py-2" />
        </div>
      </div>
    </div>
  </section>
)

const OverviewSkeleton = () => (
  <div className={`bg-white rounded-sm border border-gray-100 p-4 shadow-xs animate-pulse ${inter.variable} font-extralight`}>
    <div className="h-8 bg-gray-300 rounded w-48 mb-6" />
    <div className="space-y-4">
      <div className="h-4 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
      <div className="h-4 bg-gray-300 rounded" />
    </div>
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100">
          <div className="w-3 h-3 bg-gray-300 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-300 rounded w-16" />
            <div className="h-4 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const CarouselSkeleton = () => (
  <div className={`bg-white rounded-sm border border-gray-100 p-4 mb-6 shadow-xs animate-pulse ${inter.variable} font-extralight`}>
    <div className="flex justify-between items-center mb-4">
      <div className="h-8 bg-gray-300 rounded w-64" />
      <div className="flex gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="w-10 h-10 bg-gray-300 rounded-sm" />
        ))}
      </div>
    </div>
    <div className="max-w-[63rem] mx-auto">
      <div className="overflow-hidden">
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-0 w-full md:w-[calc(33.333%-0.666rem)] flex-shrink-0 bg-white rounded-sm border border-gray-100 p-3 space-y-2 shadow-sm">
              <div className="h-40 bg-gray-300 rounded-t-sm mb-2" />
              <div className="space-y-2">
                <div className="h-5 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const DoctorsSkeleton = () => (
  <div className={`bg-white rounded-sm border border-gray-100 p-4 mb-6 shadow-xs animate-pulse ${inter.variable} font-extralight`}>
    <div className="h-8 bg-gray-300 rounded w-64 mb-6" />
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-32 bg-gray-300 rounded-sm" />
          <div className="h-5 bg-gray-300 rounded w-3/4" />
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 2 }).map((__, j) => (
              <div key={j} className="h-4 bg-gray-300 rounded-full w-16" />
            ))}
          </div>
          <div className="flex items-center h-4 bg-gray-300 rounded w-32" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
        </div>
      ))}
    </div>
  </div>
)

// --- Main Component ---
export default function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [treatment, setTreatment] = useState<Treatment | null>(null)
  const [allBranches, setAllBranches] = useState<ExtendedBranch[]>([])
  const [allMatchingDoctors, setAllMatchingDoctors] = useState<Doctor[]>([])
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([])
  const [treatmentCategory, setTreatmentCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [branchSearchValue, setBranchSearchValue] = useState<string>('')
  const [selectedBranchId, setSelectedBranchId] = useState<string>('')

  // Embla Carousels (3 slides, slidesToScroll: 3 for consistency)
  const [branchesEmblaRef, branchesEmblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 3 },
    }
  })

  // Total unique doctors across all matching branches (full, not limited)
  const totalDoctors = useMemo(() => allMatchingDoctors.length, [allMatchingDoctors])

  // Filtered data
  const filteredBranches = useMemo(() => {
    if (selectedBranchId) {
      return allBranches.filter(b => b._id === selectedBranchId)
    }
    if (!branchSearchValue.trim()) return allBranches
    return allBranches.filter(branch =>
      branch.branchName.toLowerCase().includes(branchSearchValue.toLowerCase()) ||
      branch.hospitalName.toLowerCase().includes(branchSearchValue.toLowerCase()) ||
      branch.city.some((c: City) => c.cityName.toLowerCase().includes(branchSearchValue.toLowerCase()))
    )
  }, [allBranches, branchSearchValue, selectedBranchId])

  // Fetch data
  useEffect(() => {
    let isMounted = true
    const fetchTreatmentData = async () => {
      setLoading(true)
      setError(null)

      try {
        const resolvedParams = await params
        const treatmentSlug = resolvedParams.slug

        const res = await fetch('/api/hospitals?pageSize=1000')
        if (!res.ok) throw new Error("Failed to fetch hospitals")

        const data = await res.json() as ApiResponse

        const allExtendedTreatments = getAllExtendedTreatments(data.items)
        const allExtendedDoctors = getAllExtendedDoctors(data.items)

        const foundTreatment = allExtendedTreatments.find(t => generateSlug(t.name) === treatmentSlug)
        
        if (!foundTreatment) {
          throw new Error("Treatment not found")
        }

        const lowerTreatmentDepts = foundTreatment.departments.map(d => d.name.toLowerCase())

        // Collect all branches offering this treatment with matching doctors
        const branchesOfferingTreatment: ExtendedBranch[] = []
        data.items.forEach((hospital) => {
          hospital.branches.forEach((branch) => {
            const branchTreatments = [...(branch.treatments || []), ...(branch.specialists || []).flatMap((s: any) => s.treatments || [])]
            if (branchTreatments.some((t: any) => generateSlug(t.name) === treatmentSlug)) {
              // Find matching doctors for this branch
              const matchingDoctorsForBranch: Doctor[] = allExtendedDoctors.filter(doctor => {
                const hasLocationInThisBranch = doctor.locations.some(loc => 
                  loc.hospitalId === hospital._id && 
                  (loc.branchId === branch._id || !loc.branchId)
                )
                const deptMatch = doctor.departments.some((dept: Department) => 
                  lowerTreatmentDepts.includes(dept.name.toLowerCase())
                )
                return hasLocationInThisBranch && deptMatch
              })

              branchesOfferingTreatment.push({
                ...branch,
                hospitalName: hospital.hospitalName,
                hospitalId: hospital._id,
                hospitalLogo: hospital.logo,
                matchingDoctors: matchingDoctorsForBranch
              })
            }
          })
        })

        // Limit branches for carousel display (6 max)
        const limitedBranches = branchesOfferingTreatment.slice(0, 6)
        
        // Collect unique matching doctors across ALL branches (not limited)
        const uniqueDoctorsIds = new Set<string>()
        branchesOfferingTreatment.forEach(branch => {
          branch.matchingDoctors.forEach(doc => uniqueDoctorsIds.add(doc._id))
        })
        const allMatchingDoctors = Array.from(uniqueDoctorsIds)
          .map(id => allExtendedDoctors.find(d => d._id === id))
          .filter(Boolean)
          .sort((a, b) => {
            const expA = parseInt(a.experienceYears || '0', 10)
            const expB = parseInt(b.experienceYears || '0', 10)
            return expB - expA
          })
        
        if (isMounted) {
          console.log('Found treatment:', foundTreatment.name)
          console.log('Branches offering treatment:', branchesOfferingTreatment.length)
          console.log('Matching doctors:', allMatchingDoctors.length)
          
          setTreatment(foundTreatment)
          setAllBranches(limitedBranches)
          setAllMatchingDoctors(allMatchingDoctors)
          setAllHospitals(data.items)
          setTreatmentCategory(foundTreatment.category || '')
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching treatment:', err)
          setError(err instanceof Error ? err.message : "Failed to load treatment details")
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchTreatmentData()
    return () => { isMounted = false }
  }, [params])

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${inter.variable} font-extralight`}>
        <HeroSkeleton />
        <Breadcrumb treatmentName="Treatment Name" />
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <main className="space-y-8">
              <OverviewSkeleton />
              <CarouselSkeleton />
              <DoctorsSkeleton />
            </main>
          </div>
        </section>
      </div>
    )
  }

  if (error || !treatment) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative ${inter.variable} font-extralight`}>
        <Breadcrumb treatmentName="Treatment Name" />
        <div className={`text-center space-y-6 max-w-md p-8 bg-white rounded-sm border border-gray-100 shadow-xs ${inter.variable} font-extralight`}>
          <Scissors className="w-16 h-16 text-[#241d1f]/40 mx-auto" />
          <h2 className={`text-2xl font-extralight text-[#241d1f] ${inter.variable}`}>Treatment Not Found</h2>
          <p className={`text-[#241d1f]/70 leading-relaxed font-extralight ${inter.variable}`}>{error || "The requested treatment could not be found. Please check the URL or try searching again."}</p>
          <Link
            href="/treatment"
            className="inline-block w-full bg-[#74BF44] text-white px-6 py-3 rounded-sm hover:bg-[#74BF44]/90 transition-all font-extralight ${inter.variable} shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50"
          >
            Browse All Treatments
          </Link>
        </div>
      </div>
    )
  }

  const treatmentImage = treatment.treatmentImage ? getContentImage(treatment.treatmentImage) : null
  const heroImage = treatmentImage

  return (
    <div className={`min-h-screen bg-gray-50 font-extralight ${inter.variable}`}>
      <section className="relative w-full h-[50vh] md:h-[70vh]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${treatment.name} treatment`}
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />
        <div className="absolute bottom-0 left-0 w-full z-10 px-4 pb-12 text-white">
          <div className="container mx-auto space-y-4">
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extralight leading-tight ${inter.variable}`}>
              {treatment.name}
            </h1>
            <p className={`text-lg max-w-2xl leading-relaxed text-white/90 font-extralight ${inter.variable}`}>
              {treatment.category || 'Specialized Treatment'} 
              {totalDoctors > 0 && ` - ${totalDoctors} Specialist Doctors Available`}
            </p>
            {treatment.cost && (
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-sm text-sm font-extralight border border-white/30">
                  <Award className="w-4 h-4" />
                  Starting from ${treatment.cost}
                </span>
                {treatment.duration && (
                  <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-sm text-sm font-extralight border border-white/30">
                    <Calendar className="w-4 h-4" />
                    {treatment.duration}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Breadcrumb treatmentName={treatment.name} />

      <section className="md:py-12 relative z-10">
        <div className="container mx-auto px-4">
        <div className=" grid md:grid-cols-12 gap-8">
            <main className="space-y-8 col-span-9" >
            <section className={`bg-white rounded-sm border border-gray-100 p-6 mb-6 shadow-xs transition-all ${inter.variable} font-extralight`}>
              <h2 className={`text-2xl md:text-3xl font-medium text-[#241d1f] mb-2 tracking-tight ${inter.variable}`}>About This Treatment</h2>
              <div>
                {treatment.description && renderRichText(treatment.description)}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  {treatment.category && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100">
                      <div className="w-3 h-3 bg-[#74BF44] rounded-full flex-shrink-0"></div>
                      <div>
                        <p className={`font-extralight text-[#241d1f] text-xs uppercase tracking-wide ${inter.variable}`}>Category</p>
                        <p className={`text-[#241d1f]/70 text-sm font-extralight ${inter.variable}`}>{treatment.category}</p>
                      </div>
                    </div>
                  )}
                  {treatment.duration && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100">
                      <Calendar className="w-5 h-5 text-[#241d1f]/60 flex-shrink-0" />
                      <div>
                        <p className={`font-extralight text-[#241d1f] text-xs uppercase tracking-wide ${inter.variable}`}>Duration</p>
                        <p className={`text-[#241d1f]/70 text-sm font-extralight ${inter.variable}`}>{treatment.duration}</p>
                      </div>
                    </div>
                  )}
                  {treatment.cost && (
                    <div className="flex items-center gap-3 p-4 bg-[#74BF44]/5 rounded-sm border border-[#74BF44]/10">
                      <Award className="w-5 h-5 text-[#74BF44] flex-shrink-0" />
                      <div>
                        <p className={`font-extralight text-[#241d1f] text-xs uppercase tracking-wide ${inter.variable}`}>Estimated Cost</p>
                        <p className={`text-[#241d1f]/70 font-extralight text-sm ${inter.variable}`}>${treatment.cost}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {allBranches.length > 0 && (
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className={`text-xl font-medium text-[#241d1f] ${inter.variable}`}>Branches Offering {treatment.name}</h3>
                  <BranchesFilter
                    branches={allBranches}
                    onSearchChange={setBranchSearchValue}
                    onSelectBranch={setSelectedBranchId}
                    selectedBranchId={selectedBranchId}
                    searchValue={branchSearchValue}
                  />
                </div>
                {filteredBranches.length > 0 ? (
                  <BranchesOfferingTreatmentCarousel 
                    branches={filteredBranches} 
                    treatmentName={treatment.name}
                    emblaRef={branchesEmblaRef}
                    emblaApi={branchesEmblaApi}
                  />
                ) : (
                  <div className="text-center py-12 bg-white rounded-sm border border-gray-100" role="alert">
                    <Hospital className="w-12 h-12 text-[#241d1f]/20 mx-auto mb-4" />
                    <p className={`text-[#241d1f]/50 text-sm ${inter.variable}`}>No branches match your selection. Try adjusting your filters.</p>
                  </div>
                )}
              </section>
            )}

            {allMatchingDoctors.length > 0 && (
              <section className="space-y-4">
                <h3 className={`text-xl font-medium text-[#241d1f] ${inter.variable}`}>Specialist Doctors for {treatment.name}</h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {allMatchingDoctors.map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                  ))}
                </div>
              </section>
            )}
          </main>
          <aside className="col-span-3">
            <BranchesFilters allHospitals={allHospitals}/>
                          <ContactForm />
          </aside>
        </div>
        </div>
      </section>
    </div>
  )
}
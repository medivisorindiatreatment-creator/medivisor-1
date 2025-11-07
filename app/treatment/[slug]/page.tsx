// File: app/treatments/[slug]/page.tsx

"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Image from "next/image"
import type { HospitalWithBranchPreview } from "@/types/hospital"
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
  Phone,
  Mail,
  User,
  Clock,
  DollarSign,
  Building2,
  Search,
  X,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useEmblaCarousel from "embla-carousel-react"
import classNames from "classnames"
import ContactForm from "@/components/ContactForm"
import { Inter } from "next/font/google"

// Lightweight Inter font configuration
const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"], // Emphasize lighter weights
  variable: "--font-inter"
})

// Helper function to get Wix image URL from direct string
const getWixImageUrl = (imageStr: string): string | null => {
  if (!imageStr || typeof imageStr !== 'string') return null;
  if (!imageStr.startsWith('wix:image://v1/')) return null;

  const parts = imageStr.split('/');
  if (parts.length < 4) return null;

  const id = parts[3];
  return `https://static.wixstatic.com/media/${id}`;
}

// Helper functions
const getHospitalImage = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content || !content.nodes) return null
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    const id = imageNode.imageData.image.src.id
    return `https://static.wixstatic.com/media/${id}`
  }
  return null
}

const getTreatmentImage = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content || !content.nodes) return null
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    const id = imageNode.imageData.image.src.id
    return `https://static.wixstatic.com/media/${id}`
  }
  return null
}

const getBranchImage = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content || !content.nodes) return null
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    const id = imageNode.imageData.image.src.id
    return `https://static.wixstatic.com/media/${id}`
  }
  return null
}

const getDoctorImage = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content || !content.nodes) return null
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    const id = imageNode.imageData.image.src.id
    return `https://static.wixstatic.com/media/${id}`
  }
  return null
}

const getShortDescription = (richContent: any, maxLength: number = 100): string => {
  if (typeof richContent === 'string') {
    const text = richContent.replace(/<[^>]*>/g, '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  if (!richContent || !richContent.nodes) return '';
  let text = '';
  for (const node of richContent.nodes) {
    if (node.type === 'PARAGRAPH' && text.length < maxLength) {
      const paraText = node.nodes?.map((n: any) => n.text || '').join(' ').trim();
      text += (text ? ' ' : '') + paraText;
    }
    if (text.length >= maxLength) break;
  }
  return text.trim().length > maxLength ? text.trim().substring(0, maxLength) + '...' : text.trim();
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
        let imgSrc = null;
        if (typeof node.imageData?.image?.src === 'string') {
          imgSrc = getWixImageUrl(node.imageData.image.src);
        } else if (node.imageData?.image?.src?.id) {
          imgSrc = `https://static.wixstatic.com/media/${node.imageData.image.src.id}`;
        }
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

const generateSlug = (name: string): string => {
  return name
    ?.toLowerCase()
    ?.trim()
    ?.replace(/[^\w\s-]/g, '')
    ?.replace(/\s+/g, '-')
    ?.replace(/-+/g, '-') || ''
}

// Sub-component: Search Dropdown
interface SearchDropdownProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { id: string; name: string }[]
  selectedOption: string
  onOptionSelect: (id: string) => void
  onClear: () => void
  type: "hospital" | "city" | "treatment"
}

const SearchDropdown = ({
  value,
  onChange,
  placeholder,
  options,
  selectedOption,
  onOptionSelect,
  onClear,
  type,
}: SearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const filteredOptions = useMemo(() => 
    options.filter(option =>
      option.name.toLowerCase().includes(value.toLowerCase())
    ), [options, value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedOptionName = options.find(opt => opt.id === selectedOption)?.name

  const getIcon = () => {
    switch (type) {
      case "hospital":
        return <Building2 className="w-4 h-4 text-[#241d1f]/60" />
      case "city":
        return <MapPin className="w-4 h-4 text-[#241d1f]/60" />
      case "treatment":
        return <Stethoscope className="w-4 h-4 text-[#241d1f]/60" />
      default:
        return <Search className="w-4 h-4 text-[#241d1f]/60" />
    }
  }

  const getPlaceholder = () => {
    switch (type) {
      case "hospital":
        return "e.g., Apollo, Fortis..."
      case "city":
        return "e.g., Mumbai, Delhi..."
      case "treatment":
        return "e.g., MRI Scan, Chemotherapy..."
      default:
        return placeholder
    }
  }

  const getLabel = () => {
    switch (type) {
      case "hospital":
        return "Filter by Hospital"
      case "city":
        return "Filter by City"
      case "treatment":
        return "Filter by Treatment"
      default:
        return ""
    }
  }

  const getNoResultsText = () => {
    switch (type) {
      case "hospital":
        return "hospitals"
      case "city":
        return "cities"
      case "treatment":
        return "treatments"
      default:
        return ""
    }
  }

  return (
    <div ref={dropdownRef} className="relative space-y-2 w-full">
      <label className={`block text-sm font-extralight text-[#241d1f]/70 flex items-center gap-2 ${inter.variable}`}>
        {getIcon()}
        <span className="">{getLabel()}</span>
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#241d1f]/40">
          {getIcon()}
        </div>
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={selectedOptionName || value}
          onChange={(e) => {
            onChange(e.target.value)
            if (selectedOption) onOptionSelect("")
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className={`pl-10 pr-12 py-2.5 border border-gray-200 rounded-sm w-full text-sm bg-white focus:bg-white focus:ring-2 focus:ring-[#74BF44]/50 focus:border-[#74BF44]/50 transition-all placeholder:text-[#241d1f]/40 font-extralight ${inter.variable}`}
        />

        {(value || selectedOption) && (
          <button
            onClick={() => {
              onChange("")
              onOptionSelect("")
              onClear()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#241d1f]/40 hover:text-[#241d1f]/60 transition-colors p-1"
            aria-label="Clear filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-[#241d1f]/40 hover:text-[#241d1f]/60 transition-colors p-1"
          aria-label="Toggle dropdown"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (value || filteredOptions.length > 0) && (
        <>
          <div
            className="fixed inset-0 z-10 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-sm shadow-md max-h-60 overflow-y-auto mt-1 w-full">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onOptionSelect(option.id)
                    onChange("")
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 flex items-center gap-3 min-h-[44px] font-extralight ${inter.variable}"
                >
                  {getIcon()}
                  <div className="font-extralight text-[#241d1f]">{option.name}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-[#241d1f]/60 text-center font-extralight ${inter.variable}">
                No {getNoResultsText()} match your search. Try a different term.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Hospital Search Component
const HospitalSearch = ({
  allHospitals
}: {
  allHospitals: any[]
}) => {
  const router = useRouter()

  // Build filter options from allHospitals
  const hospitalOptions = useMemo(() => {
    return allHospitals.map(hospital => ({ id: hospital._id, name: hospital.name }))
  }, [allHospitals])

  const cityOptions = useMemo(() => {
    const cityMap: Record<string, string> = {}
    allHospitals.forEach((hospital: any) => {
      hospital.branches?.forEach((branch: any) => {
        branch.city?.forEach((city: any) => {
          if (city?._id && city?.name) cityMap[city._id] = city.name
        })
      })
    })
    return Object.entries(cityMap).map(([id, name]) => ({ id, name }))
  }, [allHospitals])

  const treatmentOptions = useMemo(() => {
    const treatmentMap: Record<string, string> = {}
    allHospitals.forEach((hospital: any) => {
      hospital.treatments?.forEach((t: any) => {
        if (t?._id && t?.name) treatmentMap[t._id] = t.name
      })
      hospital.branches?.forEach((branch: any) =>
        branch.treatments?.forEach((t: any) => {
          if (t?._id && t?.name) treatmentMap[t._id] = t.name
        })
      )
    })
    return Object.entries(treatmentMap).map(([id, name]) => ({ id, name }))
  }, [allHospitals])

  // States for filters
  const [hospitalQuery, setHospitalQuery] = useState("")
  const [cityQuery, setCityQuery] = useState("")
  const [treatmentQuery, setTreatmentQuery] = useState("")
  const [selectedHospitalId, setSelectedHospitalId] = useState("")
  const [selectedCityId, setSelectedCityId] = useState("")
  const [selectedTreatmentId, setSelectedTreatmentId] = useState("")

  const clearFilters = () => {
    setHospitalQuery("")
    setCityQuery("")
    setTreatmentQuery("")
    setSelectedHospitalId("")
    setSelectedCityId("")
    setSelectedTreatmentId("")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let url = '/hospitals?'
    let params: string[] = []

    if (selectedHospitalId || hospitalQuery) {
      params.push(`hospitalId=${encodeURIComponent(selectedHospitalId || hospitalQuery)}`)
    }
    if (selectedCityId || cityQuery) {
      params.push(`city=${encodeURIComponent(selectedCityId || cityQuery)}`)
    }
    if (selectedTreatmentId || treatmentQuery) {
      params.push(`treatment=${encodeURIComponent(selectedTreatmentId || treatmentQuery)}`)
    }

    if (params.length > 0) {
      router.push(url + params.join('&'))
    } else {
      router.push('/hospitals')
    }
  }

  return (
    <div className={`bg-white rounded-sm border border-gray-100 p-4 w-full shadow-xs ${inter.variable} font-extralight`}>
      <h3 className={`text-lg font-extralight text-[#241d1f] mb-3 flex items-center gap-2 ${inter.variable}`}>
        <Building2 className="w-4 h-4 text-[#241d1f]/70" />
        Search Hospitals
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SearchDropdown
          value={hospitalQuery}
          onChange={setHospitalQuery}
          placeholder="Search hospitals..."
          options={hospitalOptions}
          selectedOption={selectedHospitalId}
          onOptionSelect={setSelectedHospitalId}
          onClear={() => {
            setHospitalQuery("")
            setSelectedHospitalId("")
          }}
          type="hospital"
        />
        <SearchDropdown
          value={cityQuery}
          onChange={setCityQuery}
          placeholder="Search cities..."
          options={cityOptions}
          selectedOption={selectedCityId}
          onOptionSelect={setSelectedCityId}
          onClear={() => {
            setCityQuery("")
            setSelectedCityId("")
          }}
          type="city"
        />
        <SearchDropdown
          value={treatmentQuery}
          onChange={setTreatmentQuery}
          placeholder="Search treatments..."
          options={treatmentOptions}
          selectedOption={selectedTreatmentId}
          onOptionSelect={setSelectedTreatmentId}
          onClear={() => {
            setTreatmentQuery("")
            setSelectedTreatmentId("")
          }}
          type="treatment"
        />
        <button
          type="submit"
          className="w-full bg-[#74BF44] text-white py-2.5 rounded-sm hover:bg-[#74BF44]/90 transition-all font-extralight ${inter.variable} shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 text-sm"
        >
          Search
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="w-full bg-gray-50 text-[#241d1f]/70 py-2.5 rounded-sm hover:bg-gray-100 transition-all font-extralight ${inter.variable} shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 text-sm"
        >
          Clear Filters
        </button>
      </form>
      <p className={`text-xs text-[#241d1f]/50 mt-3 text-center font-extralight ${inter.variable}`}>
        Redirects to hospital list with filtered results
      </p>
    </div>
  )
}

// Breadcrumb Component
const Breadcrumb = ({ treatmentName }: { treatmentName: string }) => (
  <nav className={`bg-white border-b border-gray-100 py-3 sticky top-0 z-20 ${inter.variable} font-extralight`}>
    <div className="container mx-auto px-4">
      <div className={`flex items-center gap-2 text-sm text-[#241d1f]/60 ${inter.variable} font-extralight`}>
        <Link href="/" className="flex items-center gap-2 hover:text-[#241d1f] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 rounded-sm">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <span className="text-[#241d1f]/30">/</span>
        <Link href="/treatments" className="hover:text-[#241d1f] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 rounded-sm">
          Treatments
        </Link>
        <span className="text-[#241d1f]/30">/</span>
        <span className={`text-[#241d1f] font-extralight truncate max-w-xs`}>{treatmentName}</span>
      </div>
    </div>
  </nav>
)

// Branches Offering Treatment Carousel Component
const BranchesOfferingTreatmentCarousel = ({ 
  branches, 
  treatmentName,
  treatmentCategory
}: { 
  branches: any[], 
  treatmentName: string,
  treatmentCategory: string
}) => {
  if (branches.length === 0) return null

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: false
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const itemsPerView = 3
  const visibleSlidesClass = `min-w-0 w-full md:w-[calc(33.333%-0.666rem)] flex-shrink-0`

  const canScrollPrev = emblaApi ? emblaApi.canScrollPrev() : false
  const canScrollNext = emblaApi ? emblaApi.canScrollNext() : false

  return (
    <section className={`bg-white rounded-sm border border-gray-100 p-4 mb-6 shadow-xs ${inter.variable} font-extralight`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-2xl md:text-3xl font-medium text-[#241d1f]  mb-3 tracking-tight flex items-center gap-2 ${inter.variable}`}>
          Nearby Branches Offering {treatmentName}
          {/* <span className="text-[#241d1f]/60 font-extralight">({branches.length})</span> */}
        </h3>
        {(branches.length > itemsPerView) && (
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={classNames(
                "bg-white rounded-sm p-1.5 border border-gray-100 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50",
                !canScrollPrev && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3 h-3 text-[#241d1f]/60" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={classNames(
                "bg-white rounded-sm p-1.5 border border-gray-100 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50",
                !canScrollNext && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Next slide"
            >
              <ChevronRight className="w-3 h-3 text-[#241d1f]/60" />
            </button>
          </div>
        )}
      </div>
     <div className="max-w-[63rem] mx-auto">
  <div className="overflow-hidden" ref={emblaRef}>
    <div className="flex gap-4">
      {branches.map((branch) => {
        const hospitalImage = branch.hospitalImage
          ? getHospitalImage(branch.hospitalImage)
          : getBranchImage(branch.branchImage)
        const hospitalLogo = branch.hospitalLogo ? getHospitalImage(branch.hospitalLogo) : null
        const branchSlug = generateSlug(branch.name)
        const hospitalSlug = branch.hospitalSlug || generateSlug(branch.hospitalName)
        const firstCity = branch.city && branch.city.length > 0 ? branch.city[0].name : "N/A"
        const doctorsCount = branch.doctors?.length || branch.noOfDoctors || 0
        const bedsCount = parseInt(branch.totalBeds) || 0
        const estdYear = branch.yearEstablished || "N/A"
        const specialty = branch.primarySpecialty || treatmentCategory || "Multi-Specialty"
        const fullName = branch.hospitalName ? `${branch.hospitalName} ${branch.name}` : branch.name

        return (
          <div
            key={branch._id}
            className={classNames(
              "bg-white rounded-sm border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm",
              visibleSlidesClass
            )}
          >
            <Link
              href={`/hospitals/branches/${hospitalSlug}-${branchSlug}`}
              className="block group focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 rounded-sm"
            >
              {/* Image */}
              <div className="relative w-full h-40 rounded-t-sm overflow-hidden bg-gray-50">
                {hospitalImage ? (
                  <Image
                    src={hospitalImage}
                    alt={fullName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Hospital className="w-10 h-10 text-[#241d1f]/40" />
                  </div>
                )}

                {/* Hospital Logo */}
                {hospitalLogo && (
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm">
                    <Image
                      src={hospitalLogo}
                      alt={branch.hospitalName}
                      width={32}
                      height={32}
                      className="rounded-full object-contain"
                    />
                  </div>
                )}

                {/* Accreditation Badge */}
                {branch.accreditation?.length > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
                    {branch.accreditation.slice(0, 1).map((acc: any) => (
                      <img
                        key={acc._id}
                        src={getWixImageUrl(acc.image)}
                        alt={`${acc.name} accreditation`}
                        className="w-4 h-4 rounded-full object-contain"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`p-3 space-y-1.5 ${inter.variable} font-extralight`}>
                <h3 className={`font-extralight text-[#241d1f] text-sm leading-tight line-clamp-1 ${inter.variable}`}>
                  {fullName}
                </h3>

                <div className={`flex items-center gap-1 text-xs text-[#241d1f]/60 ${inter.variable}`}>
                  <MapPin className="w-3 h-3 flex-shrink-0 text-[#241d1f]/40" />
                  <span>{firstCity}, {specialty}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="bg-gray-50 rounded-sm p-1.5">
                    <span className={`block text-xs font-extralight text-[#241d1f] ${inter.variable}`}>{doctorsCount}</span>
                    <span className="text-xs text-[#241d1f]/60">Doctors</span>
                  </div>
                  <div className="bg-gray-50 rounded-sm p-1.5">
                    <span className={`block text-xs font-extralight text-[#241d1f] ${inter.variable}`}>{bedsCount >= 500 ? "500+" : bedsCount}</span>
                    <span className="text-xs text-[#241d1f]/60">Beds</span>
                  </div>
                  <div className="bg-gray-50 rounded-sm p-1.5">
                    <span className={`block text-xs font-extralight text-[#241d1f] ${inter.variable}`}>{estdYear}</span>
                    <span className="text-xs text-[#241d1f]/60">Estd.</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  </div>
</div>

    </section>
  )
}

// Specialist Doctors Carousel Component
const SpecialistDoctorsCarousel = ({ 
  doctors, 
  title 
}: { 
  doctors: any[], 
  title: string 
}) => {
  if (doctors.length === 0) return null

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: false
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const itemsPerView = 3
  const visibleSlidesClass = `min-w-0 w-full md:w-[calc(33.333%-0.666rem)] flex-shrink-0`

  const canScrollPrev = emblaApi ? emblaApi.canScrollPrev() : false
  const canScrollNext = emblaApi ? emblaApi.canScrollNext() : false

  return (
    <section className={`bg-white rounded-sm border border-gray-100 p-4 mb-6 shadow-xs ${inter.variable} font-extralight`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-2xl md:text-3xl font-medium text-[#241d1f]  mb-2 tracking-tight flex items-center gap-2 ${inter.variable}`}>
          {title}
          {/* <span className="text-[#241d1f]/60 font-extralight">({doctors.length})</span> */}
        </h3>
        {(doctors.length > itemsPerView) && (
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={classNames(
                "bg-white rounded-sm p-1.5 border border-gray-100 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50",
                !canScrollPrev && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3 h-3 text-[#241d1f]/60" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={classNames(
                "bg-white rounded-sm p-1.5 border border-gray-100 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50",
                !canScrollNext && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Next slide"
            >
              <ChevronRight className="w-3 h-3 text-[#241d1f]/60" />
            </button>
          </div>
        )}
      </div>
      <div className="max-w-[63rem] mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {doctors.map((doctor) => {
              const doctorImage = getDoctorImage(doctor.profileImage)
              const doctorSlug = doctor.slug || generateSlug(doctor.name)
              
              return (
                <div key={doctor._id} className={classNames("bg-white rounded-sm border border-gray-100 transition-all duration-300 shadow-sm ", visibleSlidesClass)}>
                  <Link href={`/doctors/${doctorSlug}`} className="block group focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 rounded-sm">
                    <div className="relative w-full h-40 rounded-t-sm overflow-hidden bg-gray-50">
                      {doctorImage ? (
                        <Image
                          src={doctorImage}
                          alt={doctor.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Stethoscope className="w-10 h-10 text-[#241d1f]/40" />
                        </div>
                      )}
                    </div>
                    <div className={`p-3 space-y-1.5 ${inter.variable} font-extralight`}>
                      <h3 className={`font-extralight text-[#241d1f] text-sm line-clamp-1 ${inter.variable}`}>{doctor.name}</h3>
                      <p className={`text-[#241d1f]/70 text-xs font-extralight ${inter.variable}`}>{doctor.specialization}</p>
                      {doctor.experience && (
                        <div className={`flex items-center gap-2 text-xs text-[#241d1f]/60 font-extralight ${inter.variable}`}>
                          <Clock className="w-3 h-3" />
                          <span>{doctor.experience} years experience</span>
                        </div>
                      )}
                      
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper function to get unique doctors with aggregated hospital branches
const getUniqueDoctorsWithHospitalBranches = (doctors: any[]) => {
  const uniqueDoctorsMap = new Map()

  doctors.forEach(doctor => {
    if (!uniqueDoctorsMap.has(doctor._id)) {
      uniqueDoctorsMap.set(doctor._id, {
        ...doctor,
        hospitalBranches: []
      })
    }

    const uniqueDoctor = uniqueDoctorsMap.get(doctor._id)
    if (doctor.hospitalBranches && !uniqueDoctor.hospitalBranches.some((b: any) => b.name === doctor.branchName)) {
      uniqueDoctor.hospitalBranches.push({
        name: doctor.branchName,
        slug: doctor.branchSlug
      })
    }
  })

  return Array.from(uniqueDoctorsMap.values())
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

const CarouselSkeleton = () => {
  const visibleSlidesClass = `min-w-0 w-full md:w-[calc(33.333%-0.666rem)] flex-shrink-0 bg-white rounded-sm border border-gray-100 p-3 space-y-2 shadow-sm`
  return (
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
              <div key={i} className={visibleSlidesClass}>
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
}

const SidebarSkeleton = () => (
  <div className={`space-y-6 w-full ${inter.variable} font-extralight`}>
    <div className={`bg-white rounded-sm border border-gray-100 p-4 shadow-xs animate-pulse w-full ${inter.variable} font-extralight`}>
      <div className="h-6 bg-gray-300 rounded w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-3 bg-gray-300 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className={`bg-white rounded-sm border border-gray-100 p-4 shadow-xs animate-pulse h-96 w-full ${inter.variable} font-extralight`} />
  </div>
)

// Main Component
export default function TreatmentDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [treatment, setTreatment] = useState<any>(null)
  const [specialistDoctors, setSpecialistDoctors] = useState<any[]>([])
  const [allBranches, setAllBranches] = useState<any[]>([])
  const [allHospitals, setAllHospitals] = useState<any[]>([])
  const [treatmentCategory, setTreatmentCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTreatmentData = async () => {
      setLoading(true)
      setError(null)

      try {
        const resolvedParams = await params
        const treatmentSlug = resolvedParams.slug

        const res = await fetch('/api/hospitals')
        if (!res.ok) throw new Error("Failed to fetch hospitals")

        const data = await res.json()

        let foundTreatment = null
        let allDoctorsOffering: any[] = []
        let branchesOfferingTreatment: any[] = []

        if (data.items && data.items.length > 0) {
          setAllHospitals(data.items)
          for (const hospitalItem of data.items) {
            // Skip pushing hospital-level treatments to branchesOfferingTreatment to show only branches
            if (hospitalItem.treatments && Array.isArray(hospitalItem.treatments)) {
              for (const treatmentItem of hospitalItem.treatments) {
                if (generateSlug(treatmentItem.name) === treatmentSlug) {
                  // Found the treatment
                  if (!foundTreatment) {
                    foundTreatment = treatmentItem
                  }
                }
              }
            }

            // Only collect from branch-level treatments
            if (hospitalItem.branches && Array.isArray(hospitalItem.branches)) {
              for (const branchItem of hospitalItem.branches) {
                if (branchItem.treatments && Array.isArray(branchItem.treatments)) {
                  for (const treatmentItem of branchItem.treatments) {
                    if (generateSlug(treatmentItem.name) === treatmentSlug) {
                      // Found the treatment
                      if (!foundTreatment) {
                        foundTreatment = treatmentItem
                      }
                      branchesOfferingTreatment.push({
                        ...branchItem
                      })
                    }
                  }
                }

                // Find doctors offering this exact treatment
                if (branchItem.doctors && Array.isArray(branchItem.doctors)) {
                  for (const doctor of branchItem.doctors) {
                    const hasExactTreatment = doctor.treatments?.some((t: any) => 
                      generateSlug(t.name || '') === treatmentSlug
                    )
                    
                    if (hasExactTreatment) {
                      allDoctorsOffering.push({
                        ...doctor,
                        hospitalName: hospitalItem.name,
                        branchName: branchItem.name || '',
                        hospitalSlug: hospitalItem.slug || generateSlug(hospitalItem.name),
                        branchSlug: generateSlug(branchItem.name || '')
                      })
                    }
                  }
                }
              }
            }
          }
        }

        // Remove duplicate doctors and aggregate their hospital branches
        const uniqueDoctors = getUniqueDoctorsWithHospitalBranches(allDoctorsOffering)
        
        // Limit branches to 6
        const limitedBranches = branchesOfferingTreatment.slice(0, 6)
        
        if (foundTreatment || uniqueDoctors.length > 0 || limitedBranches.length > 0) {
          if (!foundTreatment) {
            const words = treatmentSlug.split('-')
            const treatmentName = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            foundTreatment = {
              name: treatmentName,
              description: `Specialized ${treatmentName.toLowerCase()} treatment provided by expert doctors across our network of hospitals in Delhi NCR. Our team of ${uniqueDoctors.length} specialist doctors ensures you receive the highest quality care using the latest medical advancements.`,
              category: treatmentName
            }
          }

          console.log('Found treatment:', foundTreatment.name)
          console.log('Unique doctors offering treatment:', uniqueDoctors.length)
          console.log('Branches offering treatment:', limitedBranches.length)
          
          setTreatment(foundTreatment)
          setSpecialistDoctors(uniqueDoctors)
          setAllBranches(limitedBranches)
          setTreatmentCategory(foundTreatment.category)
        } else {
          throw new Error("Treatment not found")
        }
      } catch (err) {
        console.error('Error fetching treatment:', err)
        setError(err instanceof Error ? err.message : "Failed to load treatment details")
      } finally {
        setLoading(false)
      }
    }

    fetchTreatmentData()
  }, [params])

  // Loading State with Skeleton
  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${inter.variable} font-extralight`}>
        <HeroSkeleton />
        <Breadcrumb treatmentName="Treatment Name" />
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-8">
              <main className="lg:col-span-9 space-y-8">
                <OverviewSkeleton />
                <CarouselSkeleton />
                <CarouselSkeleton />
              </main>
              <aside className="lg:col-span-3 space-y-8">
                <SidebarSkeleton />
              </aside>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Error State
  if (error || !treatment) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative ${inter.variable} font-extralight`}>
        <Breadcrumb treatmentName="Treatment Name" />
        <div className={`text-center space-y-6 max-w-md p-8 bg-white rounded-sm border border-gray-100 shadow-xs ${inter.variable} font-extralight`}>
          <Scissors className="w-16 h-16 text-[#241d1f]/40 mx-auto" />
          <h2 className={`text-2xl font-extralight text-[#241d1f] ${inter.variable}`}>Treatment Not Found</h2>
          <p className={`text-[#241d1f]/70 leading-relaxed font-extralight ${inter.variable}`}>{error || "The requested treatment could not be found. Please check the URL or try searching again."}</p>
          <Link
            href="/treatments"
            className="inline-block w-full bg-[#74BF44] text-white px-6 py-3 rounded-sm hover:bg-[#74BF44]/90 transition-all font-extralight ${inter.variable} shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50"
          >
            Browse All Treatments
          </Link>
        </div>
      </div>
    )
  }

  // Derived Data
  const treatmentImage = treatment?.treatmentImage ? getTreatmentImage(treatment.treatmentImage) : null
  const heroImage = treatmentImage

  return (
    <div className={`min-h-screen bg-gray-50 font-extralight ${inter.variable}`}>
      {/* Hero Header */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full z-10 px-4 pb-12 text-white">
          <div className="container mx-auto space-y-4">
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extralight leading-tight ${inter.variable}`}>
              {treatment.name}
            </h1>
            <p className={`text-lg max-w-2xl leading-relaxed text-white/80 font-extralight ${inter.variable}`}>
              {treatment.category || 'Specialized Treatment'} 
              {specialistDoctors.length > 0 && ` - ${specialistDoctors.length} Specialist Doctors Available`}
            </p>
            {treatment.cost && (
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-sm text-sm font-extralight border border-white/20">
                  <Award className="w-4 h-4" />
                  Starting from ${treatment.cost}
                </span>
                {treatment.duration && (
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-sm text-sm font-extralight border border-white/20">
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

      {/* Main Content */}
      <section className="md:py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8">
            <main className="lg:col-span-9 space-y-8">
              {/* Treatment Overview */}
              <section className={`bg-white rounded-sm border border-gray-100 p-6 mb-6 shadow-xs transition-all ${inter.variable} font-extralight`}>
                <h2 className={`text-2xl md:text-3xl font-medium text-[#241d1f]  mb-2 tracking-tight ${inter.variable}`}>About This Treatment</h2>
                <div className="">
                  {treatment.description && (
                    <div className="prose prose-neutral prose-sm space-y-3 max-w-none">
                      {renderRichText(treatment.description)}
                    </div>
                  )}
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

              {/* Specialist Doctors Section */}
              {specialistDoctors.length > 0 && (
                <SpecialistDoctorsCarousel
                  doctors={specialistDoctors}
                  title={`Doctors Offering ${treatment.name}`}
                />
              )}

              {/* Branches Offering Treatment Section */}
              {allBranches.length > 0 && (
                <BranchesOfferingTreatmentCarousel 
                  branches={allBranches} 
                  treatmentName={treatment.name}
                  treatmentCategory={treatmentCategory}
                />
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-3 space-y-8">
              <HospitalSearch allHospitals={allHospitals} />
              <ContactForm />
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
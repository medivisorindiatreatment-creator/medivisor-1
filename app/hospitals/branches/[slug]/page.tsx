// File: app/hospitals/branches/[slug]/page.tsx
"use client"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Image from "next/image"
import type { HospitalWithBranchPreview } from "@/types/hospital"
import {
  Building2,
  Calendar,
  Bed,
  Award,
  Phone,
  Mail,
  Globe,
  MapPin,
  Users,
  Heart,
  ChevronLeft,
  Loader2,
  Stethoscope,
  Scissors,
  ChevronRight,
  Clock,
  ArrowLeft,
  Home,
  Hospital,
  Search,
  X,
  Filter,
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
// Apply font globally or to body in layout, but for component-specific, use className
// Helper function to get Wix image URL from direct string
const getWixImageUrl = (imageStr: string): string | null => {
  if (!imageStr || typeof imageStr !== 'string') return null;
  if (!imageStr.startsWith('wix:image://v1/')) return null;
  const parts = imageStr.split('/');
  if (parts.length < 4) return null;
  const id = parts[3];
  return `https://static.wixstatic.com/media/${id}`;
}
// Helper function to extract the main hospital image URL
const getHospitalImage = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content?.nodes) return null;
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE');
  return imageNode?.imageData?.image?.src?.id
    ? `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`
    : null;
}
// Helper function to extract branch image URL
const getBranchImage = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content?.nodes) return null;
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE');
  return imageNode?.imageData?.image?.src?.id
    ? `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`
    : null;
}
// Helper function to extract hospital logo URL
const getHospitalLogo = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content?.nodes) return null;
  const imageNode = content.nodes?.[0];
  if (imageNode?.type === 'IMAGE' && imageNode.imageData?.image?.src?.id) {
    return `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`;
  }
  return null;
}
// Helper function to extract doctor image URL
const getDoctorImage = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content?.nodes) return null;
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE');
  return imageNode?.imageData?.image?.src?.id
    ? `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`
    : null;
}
// Helper function to extract treatment image URL
const getTreatmentImage = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content);
  }
  if (!content?.nodes) return null;
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE');
  return imageNode?.imageData?.image?.src?.id
    ? `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`
    : null;
}
// Helper function to get short plain text description from rich content
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
// Helper function to render rich text content
const renderRichText = (richContent: any): JSX.Element | null => {
  if (typeof richContent === 'string') {
    return <div className={`text-base text-[#241d1f] leading-relaxed space-y-3 prose prose-sm max-w-none font-extralight ${inter.variable}`} dangerouslySetInnerHTML={{ __html: richContent }} />
  }
  if (!richContent || !richContent.nodes) return null
  const renderNode = (node: any): JSX.Element | null => {
    switch (node.type) {
      case 'PARAGRAPH':
        return (
          <p key={Math.random()} className={`text-base text-[#241d1f] leading-relaxed mb-2 font-extralight ${inter.variable}`}>
            {node.nodes?.map((child: any, idx: number) => renderTextNode(child, idx))}
          </p>
        )
      case 'HEADING1':
        return (
          <h3 key={Math.random()} className={`text-xl md:text-2xl font-normal text-[#241d1f] mb-2 leading-tight ${inter.variable}`}>
            {node.nodes?.map((child: any, idx: number) => renderTextNode(child, idx))}
          </h3>
        )
      case 'HEADING2':
        return (
          <h4 key={Math.random()} className={`text-xl md:text-xl font-normal text-[#241d1f] mb-2 leading-tight ${inter.variable}`}>
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
            <div key={Math.random()} className="my-4">
              <Image
                src={imgSrc}
                alt="Embedded image"
                width={600}
                height={400}
                className="w-full h-auto rounded-sm"
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
    if (isBold) content = <strong key={idx} className="font-normal">{text}</strong>
    else if (isItalic) content = <em key={idx}>{text}</em>
    else if (isUnderline) content = <u key={idx}>{text}</u>
    else content = <span key={idx} className={`font-extralight ${inter.variable}`}>{text}</span>
    return content
  }
  return (
    <div className={`space-y-4 ${inter.variable} font-extralight`}>
      {richContent.nodes.map((node: any, idx: number) => renderNode(node))}
    </div>
  )
}
// Helper function to generate a URL-friendly slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
// Breadcrumb Component
const Breadcrumb = ({ hospitalName, branchName, hospitalSlug }: { hospitalName: string; branchName: string; hospitalSlug: string }) => (
  <nav className={`bg-white border-b border-gray-100 py-4 ${inter.variable} font-extralight`}>
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-1 text-sm text-[#241d1f]/60">
        <Link href="/" className="flex items-center gap-1 hover:text-[#241d1f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 rounded-sm">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <span>/</span>
        <Link href="/hospitals" className="hover:text-[#241d1f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 rounded-sm">
          Hospitals
        </Link>
        <span>/</span>
        <Link
          href={`/hospitals/${hospitalSlug}`}
          className="hover:text-[#241d1f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 rounded-sm"
        >
          {hospitalName}
        </Link>
        <span>/</span>
        <span className="text-[#241d1f] font-normal">{branchName}</span>
      </div>
    </div>
  </nav>
)
// Accreditations List Component
const AccreditationsList = ({ accreditations }: { accreditations: any[] }) => {
  if (!accreditations || accreditations.length === 0) {
    return (
      <div className={`text-center p-6 bg-gray-50 rounded-sm border border-gray-100 ${inter.variable} font-extralight`}>
        <Award className="w-8 h-8 text-[#241d1f]/40 mx-auto mb-3" />
        <p className="text-[#241d1f]/60 text-sm">No accreditations listed</p>
        <p className="text-[#241d1f]/30 mt-2 text-xs">Accreditations</p>
      </div>
    );
  }
  return (
    <div className={`text-center p-6 bg-white rounded-sm border border-gray-100 transition-shadow ${inter.variable} font-extralight`}>
      <Award className="w-8 h-8 text-[#241d1f]/70 mx-auto mb-3" />
      <div className="space-y-1 max-h-20 overflow-y-auto">
        {accreditations.slice(0, 4).map((acc: any) => (
          <p key={acc._id} className="text-sm text-[#241d1f]/80 line-clamp-1 px-2 py-1 bg-gray-50 rounded-sm mx-auto w-full max-w-[120px]">
            {acc.name}
          </p>
        ))}
        {accreditations.length > 4 && (
          <p className="text-xs text-[#241d1f]/60 mt-2">+{accreditations.length - 4} more</p>
        )}
      </div>
      <p className="text-[#241d1f]/60 mt-3 text-xs">Accreditations</p>
    </div>
  );
}
// Specialties List Component
const SpecialtiesList = ({ specialties }: { specialties: any[] }) => {
  if (!specialties || specialties.length === 0) {
    return (
      <div className={`text-center p-6 bg-gray-50 rounded-sm border border-gray-100 ${inter.variable} font-extralight`}>
        <Heart className="w-8 h-8 text-[#241d1f] mx-auto mb-3" />
        <p className="text-[#241d1f]/60 text-xs">No specialties listed</p>
        <p className="text-[#241d1f]/30 mt-2 text-xs">Specialties</p>
      </div>
    );
  }
  return (
    <div className={`text-center p-6 bg-gray-50 rounded-sm border border-gray-100 transition-shadow ${inter.variable} font-extralight`}>
      <Heart className="w-8 h-8 text-[#241d1f] mx-auto mb-1" />
      <div className="space-y-1 max-h-20 overflow-y-auto">
        {specialties.slice(0, 4).map((spec: any) => (
          <p key={spec._id || Math.random()} className="text-3xl text-[#241d1f] line-clamp-1 px-2 py-1 bg-gray-50 rounded-sm mx-auto w-full max-w-[120px]">
            {spec.name}
          </p>
        ))}
        {specialties.length > 4 && (
          <p className="text-xs text-[#241d1f] mt-0">+{specialties.length - 4} more</p>
        )}
      </div>
      <p className="text-[#241d1f]/90 mt-0 text-sm">Specialty</p>
    </div>
  );
}
// Branch Card Component
const BranchCard = ({ branch, branchImage, hospitalSlug }: { branch: any, branchImage: string | null, hospitalSlug: string }) => {
  const firstCity = branch.city && branch.city.length > 0 ? branch.city[0].name : 'N/A'
  return (
    <Link href={`/hospitals/branches/${hospitalSlug}-${generateSlug(branch.name)}`} className="block h-full focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 rounded-sm">
      <div className="relative w-full h-48 overflow-hidden bg-gray-100 rounded-t-sm">
        {branchImage ? (
          <Image
            src={branchImage}
            alt={`${branch.name} branch facility`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Hospital className="w-12 h-12 text-[#241d1f]/40" />
          </div>
        )}
      </div>
      <div className={`p-4 space-y-2 border-t border-gray-100 ${inter.variable} font-extralight`}>
        <h3 className="text-xl md:text-xl font-normal text-[#241d1f] leading-tight line-clamp-1">{branch.name}</h3>
        <div className="flex items-center gap-1 text-xs text-[#241d1f]/60">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{firstCity}</span>
        </div>
      </div>
    </Link>
  )
}
// Doctor Card Component (Updated to handle specialization as array of objects or strings)
const DoctorCard = ({ doctor }: { doctor: any }) => {
  const doctorImage = getDoctorImage(doctor.profileImage)
  const doctorSlug = doctor.slug || generateSlug(doctor.name)
  // Updated: Handle specialization as array of objects {name} or strings
  const specializationDisplay = useMemo(() => {
    if (!doctor.specialization) return "General Practitioner";
    if (Array.isArray(doctor.specialization)) {
      let names: string[] = [];
      if (doctor.specialization.length > 0 && typeof doctor.specialization[0] === 'object' && 'name' in doctor.specialization[0]) {
        names = doctor.specialization.map((spec: any) => spec.name).filter(Boolean);
      } else {
        names = doctor.specialization.filter(Boolean) as string[];
      }
      return names.join(', ') || "General Practitioner";
    }
    return doctor.specialization as string;
  }, [doctor.specialization]);
  return (
    <Link href={`/doctors/${doctorSlug}`} className="group flex flex-col h-full bg-white border border-gray-100 rounded-xs shadow-xs overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50">
      <div className="relative h-60 overflow-hidden bg-gray-50 rounded-t-sm">
        {doctorImage ? (
          <Image
            src={doctorImage}
            alt={`${doctor.name}, ${specializationDisplay}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Stethoscope className="w-12 h-12 text-[#241d1f]/40" />
          </div>
        )}
      </div>
      <div className={`p-4 flex-1 flex flex-col ${inter.variable} font-extralight`}>
        <h3 className="text-xl md:text-xl font-normal text-[#241d1f] leading-tight mb-2 line-clamp-1">{doctor.name}</h3>
        <p className="text-sm text-[#241d1f] mb-2">{specializationDisplay}</p>
        {doctor.experience && (
          <p className="text-[#241d1f]/60 text-xs mb-3 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {doctor.experience} years of experience
          </p>
        )}
        <p className="text-[#241d1f]/60 text-xs line-clamp-2 flex-1">{getShortDescription(doctor.about)}</p>
      </div>
    </Link>
  )
}
// Treatment Card Component
const TreatmentCard = ({ item }: { item: any }) => {
  const treatmentImage = getTreatmentImage(item.treatmentImage || item.image)
  return (
    <Link href={`/treatment/${item.slug || generateSlug(item.name)}`} className="group flex flex-col h-full bg-white border border-gray-100 rounded-xs shadow-xs overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50">
      <div className="relative h-48 overflow-hidden bg-gray-50 rounded-t-sm">
        {treatmentImage ? (
          <Image
            src={treatmentImage}
            alt={`${item.name} treatment`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Scissors className="w-12 h-12 text-[#241d1f]/40" />
          </div>
        )}
      </div>
      <div className={`p-4 flex-1 flex flex-col ${inter.variable} font-extralight`}>
        <h3 className="text-xl md:text-xl font-normal text-[#241d1f] leading-tight line-clamp-1">{item.name}</h3>
      
      </div>
    </Link>
  )
}
// DoctorsList Component
const DoctorsList = ({ doctors }: { doctors: any[] }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [focused, setFocused] = useState(true)
  // Filter doctors based on name or specialization
  const filteredDoctors = useMemo(() => {
    if (!searchTerm.trim()) return []
    const lower = searchTerm.toLowerCase()
    return doctors
      .filter(doctor => {
        const name = doctor.name?.toLowerCase() || ""
        const spec = Array.isArray(doctor.specialization)
          ? doctor.specialization.map((s: any) => typeof s === 'object' ? s.name : s).join(' ').toLowerCase()
          : (doctor.specialization || "").toLowerCase()
        return name.includes(lower) || spec.includes(lower)
      })
      .slice(0, 6) // Limit results
  }, [doctors, searchTerm])
  if (doctors.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-xs shadow-xs border border-gray-100 text-center ${inter.variable} font-extralight`}>
        <Stethoscope className="w-12 h-12 text-[#241d1f]/40 mx-auto mb-3" />
        <p className="text-[#241d1f]/60 text-sm">No doctors available at this branch</p>
      </div>
    )
  }
  return (
    <section className={`bg-white rounded-xs shadow-xs border border-gray-100 ${inter.variable} font-extralight`}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-medium text-[#241d1f] tracking-tight flex items-center gap-3">
            <Stethoscope className="w-7 h-7" />
            Our Specialist Doctors ({doctors.length})
          </h2>
          {/* Search Input with Dropdown */}
          <div className="relative w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#241d1f]/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                placeholder="Search doctors by name or specialty..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-md text-base text-[#241d1f] placeholder-[#241d1f]/50 focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 focus:border-[#74BF44] transition-all"
              />
            </div>
            {/* Dropdown Results */}
            {focused && filteredDoctors.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {filteredDoctors.map((doctor) => (
                  <DoctorSearchCard key={doctor._id} doctor={doctor} onClick={() => setSearchTerm("")} />
                ))}
              </div>
            )}
            {/* No results */}
            {focused && searchTerm && filteredDoctors.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-8 text-center">
                <p className="text-[#241d1f]/60 text-sm">No doctors found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Always show all doctors in grid below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </section>
  )
}
// DoctorSearchCard Component
const DoctorSearchCard = ({ doctor, onClick }: { doctor: any; onClick: () => void }) => {
  const doctorImage = getDoctorImage(doctor.profileImage)
  const specializationDisplay = useMemo(() => {
    if (!doctor.specialization) return "General Practitioner"
    if (Array.isArray(doctor.specialization)) {
      const names = doctor.specialization
        .map((spec: any) => typeof spec === 'object' ? spec.name : spec)
        .filter(Boolean)
      return names.join(', ') || "General Practitioner"
    }
    return doctor.specialization as string
  }, [doctor.specialization])
  return (
    <Link
      href={`/hospitals?view=doctors&doctor=${encodeURIComponent(doctor.name)}`}
   
      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
    >
      <div className="relative w-16 h-16 flex-shrink-0">
        {doctorImage ? (
          <Image
            src={doctorImage}
            alt={doctor.name}
            fill
            className="object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-[#241d1f]/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#241d1f] truncate">{doctor.name}</h4>
        <p className="text-sm text-[#241d1f]/70 truncate">{specializationDisplay}</p>
        {doctor.experience && (
          <p className="text-xs text-[#74BF44] mt-1">{doctor.experience} years experience</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-[#241d1f]/40 flex-shrink-0" />
    </Link>
  )
}
// TreatmentsList Component
const TreatmentsList = ({ treatments }: { treatments: any[] }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [focused, setFocused] = useState(false)
  // Filter treatments based on name
  const filteredTreatments = useMemo(() => {
    if (!searchTerm.trim()) return []
    const lower = searchTerm.toLowerCase()
    return treatments
      .filter(treatment => treatment.name?.toLowerCase().includes(lower))
      .slice(0, 6) // Limit results
  }, [treatments, searchTerm])
  if (treatments.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-xs shadow-xs border border-gray-100 text-center ${inter.variable} font-extralight`}>
        <Scissors className="w-12 h-12 text-[#241d1f]/40 mx-auto mb-3" />
        <p className="text-[#241d1f]/60 text-sm">No treatments available at this branch</p>
      </div>
    )
  }
  return (
    <section className={`bg-white rounded-xs shadow-xs border border-gray-100 ${inter.variable} font-extralight`}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-medium text-[#241d1f] tracking-tight flex items-center gap-3">
            <Scissors className="w-7 h-7" />
            Available Treatments ({treatments.length})
          </h2>
          {/* Search Input with Dropdown */}
          <div className="relative w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#241d1f]/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                placeholder="Search treatments by name..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-md text-base text-[#241d1f] placeholder-[#241d1f]/50 focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 focus:border-[#74BF44] transition-all"
              />
            </div>
            {/* Dropdown Results */}
            {focused && filteredTreatments.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {filteredTreatments.map((treatment) => (
                  <TreatmentSearchCard key={treatment._id} treatment={treatment} onClick={() => setSearchTerm("")} />
                ))}
              </div>
            )}
            {/* No results */}
            {focused && searchTerm && filteredTreatments.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-8 text-center">
                <p className="text-[#241d1f]/60 text-sm">No treatments found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Always show all treatments in grid below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6">
        {treatments.map((treatment) => (
          <TreatmentCard key={treatment._id} item={treatment} />
        ))}
      </div>
    </section>
  )
}
// TreatmentSearchCard Component
const TreatmentSearchCard = ({ treatment, onClick }: { treatment: any; onClick: () => void }) => {
  const treatmentImage = getTreatmentImage(treatment.treatmentImage || treatment.image)
  return (
    <Link
      href={`/hospitals?view=treatments&treatment=${encodeURIComponent(treatment.name)}`}
      onClick={onClick}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
    >
      <div className="relative w-16 h-16 flex-shrink-0">
        {treatmentImage ? (
          <Image
            src={treatmentImage}
            alt={treatment.name}
            fill
            className="object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
            <Scissors className="w-8 h-8 text-[#241d1f]/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#241d1f] truncate">{treatment.name}</h4>
        <p className="text-sm text-[#241d1f]/70 truncate">{getShortDescription(treatment.description, 50)}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-[#241d1f]/40 flex-shrink-0" />
    </Link>
  )
}
// SimilarBranchesList Component
const SimilarBranchesList = ({ branches, currentCityDisplay }: { branches: any[], currentCityDisplay: string }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [focused, setFocused] = useState(false)
  // Filter branches based on name or city
  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) return []
    const lower = searchTerm.toLowerCase()
    return branches
      .filter(branch => {
        const name = branch.name?.toLowerCase() || ""
        const city = branch.city?.[0]?.name?.toLowerCase() || ""
        return name.includes(lower) || city.includes(lower)
      })
      .slice(0, 6) // Limit results
  }, [branches, searchTerm])
  if (branches.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-xs shadow-xs border border-gray-100 text-center ${inter.variable} font-extralight`}>
        <Hospital className="w-12 h-12 text-[#241d1f]/40 mx-auto mb-3" />
        <p className="text-[#241d1f]/60 text-sm">No other hospitals available in {currentCityDisplay}</p>
      </div>
    )
  }
  return (
    <section className={`bg-white rounded-xs shadow-xs border border-gray-100 ${inter.variable} font-extralight`}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-medium text-[#241d1f] tracking-tight flex items-center gap-3">
            <Hospital className="w-7 h-7" />
            Other Hospitals in {currentCityDisplay} ({branches.length})
          </h2>
          {/* Search Input with Dropdown */}
          <div className="relative w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#241d1f]/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                placeholder="Search hospitals by name or city..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-md text-base text-[#241d1f] placeholder-[#241d1f]/50 focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 focus:border-[#74BF44] transition-all"
              />
            </div>
            {/* Dropdown Results */}
            {focused && filteredBranches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {filteredBranches.map((branch) => (
                  <BranchSearchCard key={branch._id} branch={branch} onClick={() => setSearchTerm("")} />
                ))}
              </div>
            )}
            {/* No results */}
            {focused && searchTerm && filteredBranches.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-8 text-center">
                <p className="text-[#241d1f]/60 text-sm">No hospitals found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Always show all branches in grid below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6">
        {branches.map((branchItem) => {
          const branchImage = getBranchImage(branchItem.branchImage)
          const hospitalSlug = generateSlug(branchItem.hospitalName)
          return (
            <BranchCard key={branchItem._id} branch={branchItem} branchImage={branchImage} hospitalSlug={hospitalSlug} />
          )
        })}
      </div>
    </section>
  )
}
// BranchSearchCard Component
const BranchSearchCard = ({ branch, onClick }: { branch: any; onClick: () => void }) => {
  const branchImage = getBranchImage(branch.branchImage)
  const city = branch.city?.[0]?.name || 'N/A'
  return (
    <Link
      href={`/hospitals?branch=${encodeURIComponent(branch.name)}`}
      onClick={onClick}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
    >
      <div className="relative w-16 h-16 flex-shrink-0">
        {branchImage ? (
          <Image
            src={branchImage}
            alt={branch.name}
            fill
            className="object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
            <Hospital className="w-8 h-8 text-[#241d1f]/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#241d1f] truncate">{branch.name}</h4>
        <p className="text-sm text-[#241d1f]/70 truncate">{city}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-[#241d1f]/40 flex-shrink-0" />
    </Link>
  )
}
// Updated SearchDropdown Component with expanded types
const SearchDropdown = ({
  value,
  onChange,
  placeholder,
  options,
  selectedOption,
  onOptionSelect,
  onClear,
  type
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { id: string; name: string }[]
  selectedOption: string
  onOptionSelect: (id: string) => void
  onClear: () => void
  type: "branch" | "city" | "treatment" | "doctor" | "specialty"
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    )
  }, [options, value])
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
    switch (type) {
      case "branch":
        return <Building2 className="w-4 h-4 text-[#241d1f]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />;
      case "city":
        return <MapPin className="w-4 h-4 text-[#241d1f]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />;
      case "treatment":
      case "doctor":
      case "specialty":
        return <Stethoscope className="w-4 h-4 text-[#241d1f]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />;
      default:
        return null;
    }
  };
  const getNoResultsText = () => {
    switch (type) {
      case "branch": return "branches";
      case "city": return "cities";
      case "treatment": return "treatments";
      case "doctor": return "doctors";
      case "specialty": return "specializations";
      default: return "options";
    }
  };
  return (
    <div ref={dropdownRef} className="relative space-y-2">
      <div className="relative">
        {getIcon()}
        <input
          type="text"
          value={selectedOptionName}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 bg-white text-[#241d1f] placeholder-[#241d1f]/40"
        />
        {(selectedOption || value) && (
          <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#241d1f]/40 hover:text-[#241d1f]/60 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-sm shadow-md max-h-48 overflow-y-auto">
          {filteredOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onOptionSelect(option.id)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-[#241d1f] first:rounded-t-sm last:rounded-b-sm flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-[#241d1f]/40 flex-shrink-0" />
              {option.name}
            </button>
          ))}
        </div>
      )}
      {isOpen && filteredOptions.length === 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-sm shadow-md p-2 text-sm text-[#241d1f]/60">
          No {getNoResultsText()} found
        </div>
      )}
    </div>
  )
}
// View Toggle Component (similar to main page)
interface ViewToggleProps {
  view: 'hospitals' | 'doctors' | 'treatments';
  setView: (view: 'hospitals' | 'doctors' | 'treatments') => void;
}
const ViewToggle = ({ view, setView }: ViewToggleProps) => (
  <div className="flex bg-white rounded-sm shadow-sm p-1 mb-4 mx-auto lg:mx-0 max-w-md">
    <button
      type="button"
      onClick={() => setView('hospitals')}
      className={`flex-1 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
        view === 'hospitals'
          ? 'bg-gray-50 text-gray-900'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      Hospitals
    </button>
    <button
      type="button"
      onClick={() => setView('doctors')}
      className={`flex-1 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
        view === 'doctors'
          ? 'bg-gray-50 text-gray-900'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      Doctors
    </button>
    <button
      type="button"
      onClick={() => setView('treatments')}
      className={`flex-1 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
        view === 'treatments'
          ? 'bg-gray-50 text-gray-900'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      Treatments
    </button>
  </div>
);
// Updated HospitalSearch Component - Full filters matching main page
const HospitalSearch = ({
  allHospitals
}: {
  allHospitals: any[]
}) => {
  const router = useRouter()
  // States for all filters
  const [view, setView] = useState<'hospitals' | 'doctors' | 'treatments'>('hospitals');
  const [branchQuery, setBranchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [treatmentQuery, setTreatmentQuery] = useState("");
  const [doctorQuery, setDoctorQuery] = useState("");
  const [specializationQuery, setSpecializationQuery] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedTreatmentId, setSelectedTreatmentId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedSpecializationId, setSelectedSpecializationId] = useState("");
  // Compute filtered branches for cascading
  const getFilteredBranches = useMemo(() => {
    let filteredHospitals = allHospitals;
    let branches: { b: any; h: any }[] = filteredHospitals.flatMap((h: any) =>
      h.branches ? h.branches.map((b: any) => ({ b, h })) : []
    );
    if (selectedCityId) {
      branches = branches.filter(({ b }) => b.city && b.city.some((c: any) => c._id === selectedCityId));
    }
    if (selectedBranchId) {
      branches = branches.filter(({ b }) => b._id === selectedBranchId);
    }
    return branches;
  }, [allHospitals, selectedCityId, selectedBranchId]);
  // Branch options
  const availableBranchOptions = useMemo(() => {
    const branches = getFilteredBranches;
    const branchMap = new Map<string, string>();
    branches.forEach(({ b }) => {
      if (b._id && b.name) branchMap.set(b._id, b.name);
    });
    return Array.from(branchMap.entries()).map(([id, name]) => ({ id, name }));
  }, [getFilteredBranches]);
  // City options
  const availableCityOptions = useMemo(() => {
    const branches = getFilteredBranches;
    let cities = branches.flatMap(({ b }) => b.city || []);
    if (branches.length === 0) {
      cities = allHospitals.flatMap((h: any) => h.branches?.flatMap((b: any) => b.city || []) || []);
    }
    const cityMap = new Map<string, string>();
    cities.forEach((c: any) => {
      if (c._id && c.name) cityMap.set(c._id, c.name);
    });
    return Array.from(cityMap.entries()).map(([id, name]) => ({ id, name }));
  }, [getFilteredBranches, allHospitals]);
  // Treatment options
  const availableTreatmentOptions = useMemo(() => {
    const branches = getFilteredBranches;
    let treatments = branches.flatMap(({ h, b }) => [...(h.treatments || []), ...(b.treatments || [])]);
    if (branches.length === 0) {
      treatments = allHospitals.flatMap((h: any) => [...(h.treatments || []), ...h.branches.flatMap((b: any) => b.treatments || [])]);
    }
    const treatMap = new Map<string, string>();
    treatments.forEach((t: any) => {
      if (t?._id && t.name) treatMap.set(t._id, t.name);
    });
    return Array.from(treatMap.entries()).map(([id, name]) => ({ id, name }));
  }, [getFilteredBranches, allHospitals]);
  // Doctor options
  const availableDoctorOptions = useMemo(() => {
    const branches = getFilteredBranches;
    let doctors = branches.flatMap(({ h, b }) => [...(h.doctors || []), ...(b.doctors || [])]);
    if (branches.length === 0) {
      doctors = allHospitals.flatMap((h: any) => [...(h.doctors || []), ...h.branches.flatMap((b: any) => b.doctors || [])]);
    }
    const docMap = new Map<string, string>();
    doctors.forEach((d: any) => {
      if (d?._id && d.name) docMap.set(d._id, d.name);
    });
    return Array.from(docMap.entries()).map(([id, name]) => ({ id, name }));
  }, [getFilteredBranches, allHospitals]);
  // Specialization options
  const availableSpecializationOptions = useMemo(() => {
    const branches = getFilteredBranches;
    let doctors = branches.flatMap(({ h, b }) => [...(h.doctors || []), ...(b.doctors || [])]);
    if (branches.length === 0) {
      doctors = allHospitals.flatMap((h: any) => [...(h.doctors || []), ...h.branches.flatMap((b: any) => b.doctors || [])]);
    }
    const specMap = new Map<string, string>();
    doctors.forEach((d: any) => {
      const specs = d.specialization;
      if (Array.isArray(specs)) {
        specs.forEach((spec: any) => {
          const id = spec?._id || (typeof spec === 'string' ? spec : '');
          const name = spec?.name || (typeof spec === 'string' ? spec : '');
          if (id && name) specMap.set(id, name);
        });
      } else if (specs) {
        specMap.set(specs, specs);
      }
    });
    return Array.from(specMap.entries()).map(([id, name]) => ({ id, name }));
  }, [getFilteredBranches, allHospitals]);
  // Helper function to handle option selection
  const handleBranchSelect = useCallback((id: string) => {
    const option = availableBranchOptions.find(o => o.id === id);
    if (option) {
      setSelectedBranchId(id);
      setBranchQuery(option.name);
    }
  }, [availableBranchOptions]);
  const handleCitySelect = useCallback((id: string) => {
    const option = availableCityOptions.find(o => o.id === id);
    if (option) {
      setSelectedCityId(id);
      setCityQuery(option.name);
    }
  }, [availableCityOptions]);
  const handleTreatmentSelect = useCallback((id: string) => {
    const option = availableTreatmentOptions.find(o => o.id === id);
    if (option) {
      setSelectedTreatmentId(id);
      setTreatmentQuery(option.name);
    }
  }, [availableTreatmentOptions]);
  const handleDoctorSelect = useCallback((id: string) => {
    const option = availableDoctorOptions.find(o => o.id === id);
    if (option) {
      setSelectedDoctorId(id);
      setDoctorQuery(option.name);
    }
  }, [availableDoctorOptions]);
  const handleSpecializationSelect = useCallback((id: string) => {
    const option = availableSpecializationOptions.find(o => o.id === id);
    if (option) {
      setSelectedSpecializationId(id);
      setSpecializationQuery(option.name);
    }
  }, [availableSpecializationOptions]);
  // Clear invalid selections when options change
  useEffect(() => {
    if (selectedBranchId && !availableBranchOptions.find((o) => o.id === selectedBranchId)) {
      setSelectedBranchId("");
      setBranchQuery("");
    }
  }, [availableBranchOptions, selectedBranchId]);
  useEffect(() => {
    if (selectedCityId && !availableCityOptions.find((o) => o.id === selectedCityId)) {
      setSelectedCityId("");
      setCityQuery("");
    }
  }, [availableCityOptions, selectedCityId]);
  useEffect(() => {
    if (selectedTreatmentId && !availableTreatmentOptions.find((o) => o.id === selectedTreatmentId)) {
      setSelectedTreatmentId("");
      setTreatmentQuery("");
    }
  }, [availableTreatmentOptions, selectedTreatmentId]);
  useEffect(() => {
    if (selectedDoctorId && !availableDoctorOptions.find((o) => o.id === selectedDoctorId)) {
      setSelectedDoctorId("");
      setDoctorQuery("");
    }
  }, [availableDoctorOptions, selectedDoctorId]);
  useEffect(() => {
    if (selectedSpecializationId && !availableSpecializationOptions.find((o) => o.id === selectedSpecializationId)) {
      setSelectedSpecializationId("");
      setSpecializationQuery("");
    }
  }, [availableSpecializationOptions, selectedSpecializationId]);
  const clearFilters = () => {
    setBranchQuery("");
    setCityQuery("");
    setTreatmentQuery("");
    setDoctorQuery("");
    setSpecializationQuery("");
    setSelectedBranchId("");
    setSelectedCityId("");
    setSelectedTreatmentId("");
    setSelectedDoctorId("");
    setSelectedSpecializationId("");
    setView('hospitals');
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let url = '/hospitals?';
    let params: string[] = [];
    if (view !== 'hospitals') {
      params.push(`view=${view}`);
    }
    if (branchQuery) {
      params.push(`branch=${encodeURIComponent(branchQuery)}`);
    }
    if (cityQuery) {
      params.push(`city=${encodeURIComponent(cityQuery)}`);
    }
    if (treatmentQuery) {
      params.push(`treatment=${encodeURIComponent(treatmentQuery)}`);
    }
    if (view === 'doctors') {
      if (doctorQuery) {
        params.push(`doctor=${encodeURIComponent(doctorQuery)}`);
      }
      if (specializationQuery) {
        params.push(`specialization=${encodeURIComponent(specializationQuery)}`);
      }
    }
    if (params.length > 0) {
      router.push(url + params.join('&'));
    } else {
      router.push('/hospitals');
    }
  };
  return (
    <div className={`bg-white p-4 rounded-xs shadow-xs border border-gray-100 ${inter.variable} font-extralight`}>
      <h3 className="text-xl md:text-2xl font-normal text-[#241d1f] leading-tight mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Search Hospitals & More
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ViewToggle view={view} setView={setView} />
        {view === 'hospitals' && (
          <SearchDropdown
            value={branchQuery}
            onChange={setBranchQuery}
            placeholder="Search branches..."
            options={availableBranchOptions}
            selectedOption={selectedBranchId}
            onOptionSelect={handleBranchSelect}
            onClear={() => {
              setBranchQuery("");
              setSelectedBranchId("");
            }}
            type="branch"
          />
        )}
        <SearchDropdown
          value={cityQuery}
          onChange={setCityQuery}
          placeholder="Search cities..."
          options={availableCityOptions}
          selectedOption={selectedCityId}
          onOptionSelect={handleCitySelect}
          onClear={() => {
            setCityQuery("");
            setSelectedCityId("");
          }}
          type="city"
        />
        <SearchDropdown
          value={treatmentQuery}
          onChange={setTreatmentQuery}
          placeholder="Search treatments..."
          options={availableTreatmentOptions}
          selectedOption={selectedTreatmentId}
          onOptionSelect={handleTreatmentSelect}
          onClear={() => {
            setTreatmentQuery("");
            setSelectedTreatmentId("");
          }}
          type="treatment"
        />
        {view === 'doctors' && (
          <>
            <SearchDropdown
              value={doctorQuery}
              onChange={setDoctorQuery}
              placeholder="Search doctors..."
              options={availableDoctorOptions}
              selectedOption={selectedDoctorId}
              onOptionSelect={handleDoctorSelect}
              onClear={() => {
                setDoctorQuery("");
                setSelectedDoctorId("");
              }}
              type="doctor"
            />
            <SearchDropdown
              value={specializationQuery}
              onChange={setSpecializationQuery}
              placeholder="Search specializations..."
              options={availableSpecializationOptions}
              selectedOption={selectedSpecializationId}
              onOptionSelect={handleSpecializationSelect}
              onClear={() => {
                setSpecializationQuery("");
                setSelectedSpecializationId("");
              }}
              type="specialty"
            />
          </>
        )}
        <button
          type="submit"
          className="w-full bg-[#74BF44] text-white py-2 rounded-sm hover:bg-[#74BF44]/90 transition-all font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50"
        >
          Search & Redirect
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="w-full bg-gray-50 text-[#241d1f]/70 py-2 rounded-sm hover:bg-gray-100 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50"
        >
          Clear All Filters
        </button>
      </form>
      <p className="text-xs text-[#241d1f]/50 mt-2 text-center">
        Redirects to hospital directory with auto-filled filters
      </p>
    </div>
  )
}
// Skeleton Components (unchanged, truncated for brevity)
const HeroSkeleton = () => (
  <section className="relative w-full h-[70vh] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 z-10 pb-12">
      <div className="container mx-auto px-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-300 rounded w-64" />
            <div className="h-4 bg-gray-300 rounded w-96" />
          </div>
        </div>
      </div>
    </div>
  </section>
)
const OverviewSkeleton = () => (
  <div className={`bg-white p-4 rounded-sm border border-gray-100 shadow-sm animate-pulse ${inter.variable} font-extralight`}>
    <div className="h-8 bg-gray-300 rounded w-48 mb-6" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center p-6">
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-3" />
          <div className="h-6 bg-gray-300 rounded mx-auto w-20" />
          <div className="h-4 bg-gray-300 rounded mx-auto w-16 mt-2" />
        </div>
      ))}
    </div>
  </div>
)
const AboutSkeleton = () => (
  <div className={`bg-white p-4 rounded-sm border border-gray-100 shadow-sm animate-pulse ${inter.variable} font-extralight`}>
    <div className="h-8 bg-gray-300 rounded w-48 mb-4" />
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 rounded" />
      ))}
    </div>
  </div>
)
const CarouselSkeleton = ({ type }: { type: string }) => (
  <div className={`bg-white p-4 rounded-sm border border-gray-100 shadow-sm animate-pulse ${inter.variable} font-extralight`}>
    <div className="h-8 bg-gray-300 rounded w-64 mb-4" />
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-80">
          <div className="h-48 bg-gray-300 rounded-sm mb-4" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
)
const FacilitiesSkeleton = () => (
  <div className={`bg-white p-4 rounded-sm border border-gray-100 shadow-sm animate-pulse ${inter.variable} font-extralight`}>
    <div className="h-8 bg-gray-300 rounded w-48 mb-4" />
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-md">
          <div className="w-3 h-3 bg-gray-300 rounded-full" />
          <div className="h-4 bg-gray-300 rounded w-32" />
        </div>
      ))}
    </div>
  </div>
)
const SidebarSkeleton = () => (
  <div className={`space-y-6 ${inter.variable} font-extralight`}>
    <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm animate-pulse">
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
    <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm animate-pulse h-96" />
  </div>
)
// Main Branch Detail Component
export default function BranchDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [branch, setBranch] = useState<any>(null)
  const [hospital, setHospital] = useState<HospitalWithBranchPreview | null>(null)
  const [allHospitals, setAllHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchBranchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const resolvedParams = await params
        const branchSlug = resolvedParams.slug
        const res = await fetch('/api/hospitals')
        if (!res.ok) throw new Error("Failed to fetch hospitals")
        const data = await res.json()
        if (data.items && data.items.length > 0) {
          let foundBranch = null
          let foundHospital = null
          for (const hospitalItem of data.items) {
            const hospitalSlug = generateSlug(hospitalItem.name)
            if (hospitalItem.branches && hospitalItem.branches.length > 0) {
              for (const branchItem of hospitalItem.branches) {
                const branchNameSlug = generateSlug(branchItem.name)
                const combinedSlug = `${hospitalSlug}-${branchNameSlug}`
                if (combinedSlug === branchSlug) {
                  foundBranch = branchItem
                  foundHospital = hospitalItem
                  break
                }
              }
            }
            if (foundBranch) break
          }
          if (foundBranch && foundHospital) {
            setBranch(foundBranch)
            setHospital(foundHospital)
            setAllHospitals(data.items)
          } else {
            throw new Error("Branch not found")
          }
        } else {
          throw new Error("No hospitals available")
        }
      } catch (err) {
        console.error('Error fetching branch:', err)
        setError(err instanceof Error ? err.message : "Failed to load branch details")
      } finally {
        setLoading(false)
      }
    }
    fetchBranchData()
  }, [params])
  // Loading State with Skeleton
  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${inter.variable} font-extralight`}>
        <HeroSkeleton />
        <Breadcrumb hospitalName="Hospital Name" branchName="Branch Name" hospitalSlug="" />
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid lap:grid-cols-12 gap-8">
              <main className="lap:col-span-9 space-y-8">
                <OverviewSkeleton />
                <AboutSkeleton />
                <CarouselSkeleton type="doctors" />
                <CarouselSkeleton type="treatments" />
                <FacilitiesSkeleton />
                <CarouselSkeleton type="hospitals" />
              </main>
              <SidebarSkeleton />
            </div>
          </div>
        </section>
      </div>
    )
  }
  // Error State
  if (error || !branch || !hospital) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative ${inter.variable} font-extralight`}>
        <Breadcrumb hospitalName="Hospital Name" branchName="Branch Name" hospitalSlug="" />
        <div className="text-center space-y-6 max-w-md p-8 bg-white rounded-xs shadow-xs border border-gray-100">
          <Building2 className="w-16 h-16 text-[#241d1f]/40 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-normal text-[#241d1f] leading-tight">Branch Not Found</h2>
          <p className="text-base text-[#241d1f] leading-relaxed font-extralight">{error || "The requested branch could not be found. Please check the URL or try searching again."}</p>
          <Link
            href="/hospitals"
            className="inline-block w-full bg-[#74BF44] text-white px-6 py-3 rounded-sm hover:bg-[#74BF44]/90 transition-all font-normal shadow-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50"
          >
            Go to Hospital Search
          </Link>
        </div>
      </div>
    )
  }
  // Derived Data
  const branchImage = getBranchImage(branch.branchImage)
  const hospitalImage = getHospitalImage(hospital.image)
  const heroImage = branchImage || hospitalImage
  const hospitalLogo = getHospitalLogo(hospital.logo)
  const hospitalSlug = hospital.slug || generateSlug(hospital.name)
  // Compute similar branches in nearby cities (same city)
  const currentCities = branch.city ? branch.city.map((c: any) => c.name) : []
  const similarBranches = allHospitals
    .filter((h: any) => h._id !== hospital._id)
    .flatMap((h: any) =>
      h.branches
        .filter((b: any) => b.city && b.city.some((c: any) => currentCities.includes(c.name)))
        .map((b: any) => ({ ...b, hospitalName: h.name }))
    )
    .slice(0, 6)
  const currentCityDisplay = branch.city?.[0]?.name || 'Nearby Cities'
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.variable} font-extralight`}>
      {/* Hero Header */}
      <section className="relative w-full h-[70vh]">
        {/* Background Image */}
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${hospital.name} ${branch.name} facility`}
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Accreditation Badge (Top Right) */}
        {branch.accreditation?.length > 0 && (
          <div className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-1 py-1 rounded-full shadow-md">
            <div className="flex items-center gap-1">
              {branch.accreditation.slice(0, 1).map((acc: any) => (
                <img
                  key={acc._id}
                  src={getWixImageUrl(acc.image)}
                  alt={`${acc.name} accreditation badge`}
                  className="w-10 h-10 rounded-full object-contain"
                />
              ))}
            </div>
          </div>
        )}
        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-12 text-white">
          <div className="container mx-auto px-4 space-y-5">
            {/* Logo and Name */}
            <div className="flex gap-x-4 items-center">
              {hospitalLogo && (
                <div className="relative w-16 h-16 bg-white rounded-full p-2 shadow-md">
                  <Image
                    src={hospitalLogo}
                    alt={`${hospital.name} logo`}
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-normal text-white mb-1 leading-tight">
                  {branch.name}
                </h1>
                <div className="flex flex-wrap gap-x-2 mt-0 text-lg text-white/80">
                  {branch.specialties?.slice(0, 3).map((spec: any) => (
                    <span key={spec._id}>{spec.name} speciality</span>
                  ))}
                  {branch.specialties?.length > 3 && (
                    <span className="text-white/60">
                      +{branch.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Address & Emergency Contact */}
            <div className="flex flex-wrap gap-3 mt-2">
              {branch.address && (
                <span className="flex items-center gap-2 text-base sm:text-lg">
                  <MapPin className="w-5 h-5 text-white" />
                  {branch.address}
                </span>
              )}
              {branch.emergencyContact && (
                <span className="flex items-center gap-2 bg-red-600/20 px-4 py-2 rounded-md text-sm font-normal border border-red-500/40 backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-red-300" />
                  24/7: {branch.emergencyContact}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
      <Breadcrumb hospitalName={hospital.name} branchName={branch.name} hospitalSlug={hospitalSlug} />
      {/* Main Content */}
      <section className="py-12 relative z-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-9 space-y-8">
              {/* Branch Overview */}
              <section className={`bg-white p-6 rounded-xs shadow-xs border border-gray-100 transition-all ${inter.variable} font-extralight`}>
                <h2 className="text-2xl md:text-3xl font-medium text-[#241d1f] mb-3 tracking-tight">
                  Hospital Overview
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {branch.specialties?.length > 0 && (
                    <SpecialtiesList specialties={branch.specialties} />
                  )}
                   {branch.yearEstablished && (
                    <StatCard
                      icon={Calendar}
                      value={branch.yearEstablished}
                      label="Established"
                      showPlus={false}
                    />
                  )}
                  {branch.totalBeds && (
                    <StatCard icon={Bed} value={branch.totalBeds} label="Beds" showPlus={true} />
                  )}
                  {branch.icuBeds && (
                    <StatCard icon={Bed} value={branch.icuBeds} label="ICU Beds" showPlus={true} />
                  )}
                  {branch.noOfDoctors && (
                    <StatCard icon={Users} value={branch.noOfDoctors} label="Doctors" showPlus={true} />
                  )}
                
                </div>
              </section>
              {/* About Branch */}
              {branch.description && (
                <section className={`bg-white p-6 rounded-xs shadow-xs border border-gray-100 transition-all ${inter.variable} font-extralight`}>
                  <h2 className="text-2xl md:text-3xl font-medium text-[#241d1f] mb-2 tracking-tight">
                    About {branch.name}
                  </h2>
                  <div className="text-[17px] text-[#241d1f] leading-relaxed font-extralight">
                    {renderRichText(branch.description)}
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/hospitals/${hospitalSlug}`}
                      className="text-sm text-[#74BF44] font-normal underline decoration-1 decoration-[#74BF44] underline-offset-4 leading-relaxed pb-1 hover:text-[#74BF44]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#74BF44]/50 tracking-wide"
                    >
                      Explore More About Our Group Hospitals
                    </Link>
                  </div>
                </section>
              )}
              {/* Doctors Section */}
              {branch.doctors && branch.doctors.length > 0 && (
                <section>
                  <DoctorsList doctors={branch.doctors} />
                </section>
              )}
              {/* Treatments Section */}
              {branch.treatments && branch.treatments.length > 0 && (
                <section>
                  <TreatmentsList treatments={branch.treatments} />
                </section>
              )}
              {/* Similar Branches Section */}
              <SimilarBranchesList
                branches={similarBranches}
                currentCityDisplay={currentCityDisplay}
              />
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
// Stat Card Component
const StatCard = ({ icon: Icon, value, label, showPlus = true }: { icon: any; value: string | number; label: string; showPlus?: boolean }) => (
  <div className={`text-center p-6 bg-gray-50 rounded-xs border border-gray-100 transition-shadow ${inter.variable} font-extralight flex flex-col items-center justify-center`}>
    <Icon className="w-8 h-8 text-[#241d1f] mb-2 flex-shrink-0" />
    <p className="text-3xl font-normal text-[#241d1f] mb-">{value}{showPlus ? '+' : ''}</p>
    <p className="text-[#241d1f] text-sm text-center">{label}</p>
  </div>
)
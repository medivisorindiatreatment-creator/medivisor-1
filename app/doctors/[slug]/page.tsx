// File: app/doctors/[slug]/page.tsx

"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import type { HospitalWithBranchPreview } from "@/types/hospital"
import {
  Building2,
  Calendar,
  Bed,
  Award,
  Stethoscope,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Home,
  Hospital,
  Users,
  Phone,
  Mail,
  Clock,
  User
} from "lucide-react"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import classNames from "classnames"
import ContactForm from "@/components/ContactForm"

// Helper function to extract the main hospital image URL from rich content
const getHospitalImage = (richContent: any): string | null => {
  if (typeof richContent === 'string') return richContent
  if (!richContent || !richContent.nodes) return null
  const imageNode = richContent.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    const id = imageNode.imageData.image.src.id
    return `https://static.wixstatic.com/media/${id}`
  }
  return null
}

// Helper function to extract doctor image URL from rich content
const getDoctorImage = (richContent: any): string | null => {
  if (typeof richContent === 'string') return richContent
  if (!richContent || !richContent.nodes) return null
  const imageNode = richContent.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    const id = imageNode.imageData.image.src.id
    return `https://static.wixstatic.com/media/${id}`
  }
  return null
}

// Helper function to extract treatment image URL from rich content
const getTreatmentImage = (richContent: any): string | null => {
  if (typeof richContent === 'string') return richContent
  if (!richContent || !richContent.nodes) return null
  const imageNode = richContent.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    const id = imageNode.imageData.image.src.id
    return `https://static.wixstatic.com/media/${id}`
  }
  return null
}

// Helper function to get short plain text about from rich content
const getShortabout = (richContent: any, maxLength: number = 100): string => {
  if (typeof richContent === 'string') {
    const text = richContent.replace(/<[^>]*>/g, '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  if (!richContent || !richContent.nodes) return '';
  let text = '';
  for (const node of richContent.nodes) {
    if (node.type === 'PARAGRAPH' && text.length < maxLength) {
      const paraText = node.nodes?.map((n: any) => n.textData?.text || n.text || '').join(' ').trim();
      text += (text ? ' ' : '') + paraText;
    }
    if (text.length >= maxLength) break;
  }
  return text.trim().length > maxLength ? text.trim().substring(0, maxLength) + '...' : text.trim();
}

// Helper function to get plain text from rich content
const getPlainText = (richContent: any): string => {
  if (typeof richContent === 'string') {
    return richContent.replace(/<[^>]*>/g, '').trim();
  }
  if (!richContent || !richContent.nodes) return '';
  let text = '';
  const traverse = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.type === 'TEXT') {
        text += (node.textData?.text || node.text || '');
      } else if (node.nodes && node.nodes.length > 0) {
        traverse(node.nodes);
      }
    }
  };
  traverse(richContent.nodes);
  return text.replace(/\s+/g, ' ').trim();
}

// Helper function to render rich text content (updated for textData.text and decorations)
const renderRichText = (richContent: any): JSX.Element | null => {
  if (typeof richContent === 'string') {
    return <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: richContent }} />
  }
  if (!richContent || !richContent.nodes || richContent.nodes.length === 0) return null

  const renderNode = (node: any, key: string | number): JSX.Element | null => {
    switch (node.type) {
      case 'PARAGRAPH':
        return (
          <p key={key} className="text-gray-700 leading-relaxed mb-3">
            {node.nodes?.map((child: any, idx: number) => renderNode(child, idx))}
          </p>
        )
      case 'HEADING1':
        return (
          <h3 key={key} className="text-xl font-semibold text-gray-900 mb-3">
            {node.nodes?.map((child: any, idx: number) => renderNode(child, idx))}
          </h3>
        )
      case 'HEADING2':
        return (
          <h4 key={key} className="text-lg font-semibold text-gray-900 mb-3">
            {node.nodes?.map((child: any, idx: number) => renderNode(child, idx))}
          </h4>
        )
      case 'HEADING3':
        return (
          <h5 key={key} className="text-base font-semibold text-gray-900 mb-3">
            {node.nodes?.map((child: any, idx: number) => renderNode(child, idx))}
          </h5>
        )
      case 'HEADING4':
        return (
          <h6 key={key} className="text-sm font-semibold text-gray-900 mb-3">
            {node.nodes?.map((child: any, idx: number) => renderNode(child, idx))}
          </h6>
        )
      case 'IMAGE':
        const imgSrc = node.imageData?.image?.src?.id
          ? `https://static.wixstatic.com/media/${node.imageData.image.src.id}`
          : null
        if (imgSrc) {
          return (
            <div key={key} className="my-4">
              <Image
                src={imgSrc}
                alt="Embedded image"
                width={600}
                height={400}
                className="w-full h-auto rounded-md"
              />
            </div>
          )
        }
        return null
      case 'LIST_ITEM':
      case 'LIST_NUMBERED_ITEM':
        return (
          <li key={key} className={`text-gray-700 leading-relaxed mb-1 ${node.type === 'LIST_NUMBERED_ITEM' ? 'list-decimal ml-6' : 'list-disc ml-6'}`}>
            {node.nodes?.map((child: any, idx: number) => renderNode(child, idx))}
          </li>
        )
      case 'LIST':
        const isOrdered = node.listStyle === 'ordered' || node.type?.includes('NUMBERED')
        return (
          <ul key={key} className={isOrdered ? 'list-decimal ml-6 mb-3' : 'list-disc ml-6 mb-3'}>
            {node.nodes?.map((child: any, idx: number) => renderNode(child, idx))}
          </ul>
        )
      case 'TEXT':
        const text = node.textData?.text || node.text || ''
        const decorations = node.textData?.decorations || []
        const isBold = decorations.some((dec: any) => dec?.type === 'bold' || dec === 'bold')
        const isItalic = decorations.some((dec: any) => dec?.type === 'italic' || dec === 'italic')
        const isUnderline = decorations.some((dec: any) => dec?.type === 'underline' || dec === 'underline')
        const isLink = node.link?.url

        let content = text
        if (isLink) {
          content = <a key={key} href={isLink} className="text-gray-600 hover:underline">{text}</a>
        } else if (isBold && isItalic) {
          content = <strong key={key}><em>{text}</em></strong>
        } else if (isBold) {
          content = <strong key={key}>{text}</strong>
        } else if (isItalic) {
          content = <em key={key}>{text}</em>
        } else if (isUnderline) {
          content = <u key={key}>{text}</u>
        } else {
          content = <span key={key}>{text}</span>
        }

        return <>{content}</>
      case 'SPAN':
      case 'INLINE_EMBED':
        return (
          <span key={key} className={node.textStyle ? `font-${node.textStyle.fontSize || 'base'} ${node.textStyle.color ? `text-${node.textStyle.color}` : ''}` : ''}>
            {node.nodes?.map((child: any, idx: number) => renderNode(child, idx))}
          </span>
        )
      default:
        if (node.textData?.text || node.text) {
          return <span key={key}>{node.textData?.text || node.text}</span>
        }
        return node.nodes?.length > 0 ? (
          <span key={key}>{node.nodes.map((child: any, idx: number) => renderNode(child, idx))}</span>
        ) : null
    }
  }

  return (
    <div className="space-y-4">
      {richContent.nodes.map((node: any, idx: number) => renderNode(node, idx))}
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
const Breadcrumb = ({ hospitalName, branchName, doctorName, hospitalSlug }: { hospitalName: string; branchName: string; doctorName: string; hospitalSlug: string }) => (
  <nav className="bg-white border-b border-gray-200 py-4">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Link href="/" className="flex items-center gap-1 hover:text-gray-900 transition-colors">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <span>/</span>
        <Link href="/hospitals" className="hover:text-gray-900 transition-colors">
          Hospitals
        </Link>
        <span>/</span>
        <Link
          href={`/hospitals/${hospitalSlug}`}
          className="hover:text-gray-900 transition-colors"
        >
          {hospitalName}
        </Link>
        <span>/</span>
        <Link
          href={`/hospitals/${hospitalSlug}/branches/${generateSlug(branchName)}`}
          className="hover:text-gray-900 transition-colors"
        >
          {branchName}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{doctorName}</span>
      </div>
    </div>
  </nav>
)

// Doctor Card Component for Similar Doctors
const DoctorCard = ({ doctor, branchName }: { doctor: any, branchName: string }) => {
  const doctorImage = getDoctorImage(doctor.profileImage)
  const doctorSlug = generateSlug(doctor.name)

  return (
    <Link
      href={`/doctors/${doctorSlug}`}
      className="group h-full flex flex-col hover:no-underline bg-white rounded-xs shadow-xs overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative flex-1 min-h-48 bg-gray-50">
        {doctorImage ? (
          <Image
            src={doctorImage}
            alt={doctor.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h5 className="font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-gray-600 transition-colors duration-200">{doctor.name}</h5>
          <p className="text-gray-600 font-medium text-sm">{doctor.specialization}</p>
          <p className="text-gray-600 text-xs">{doctor.qualification}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {doctor.experience} yrs</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {doctor.designation}</span>
          </div>
          {doctor.languagesSpoken && (
            <p className="text-gray-500 text-xs">Lang: {doctor.languagesSpoken}</p>
          )}
        </div>
        {branchName && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-gray-600 text-xs font-medium">At {branchName}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

// Similar Doctors Carousel Component
const SimilarDoctorsCarousel = ({ doctors, currentDoctorId }: { doctors: any[], currentDoctorId: string }) => {
  const similarDoctors = doctors
    .filter(d => d._id !== currentDoctorId)
    .slice(0, 6)

  if (similarDoctors.length === 0) return null

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps'
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const itemsPerView = 3
  const visibleSlidesClass = `min-w-0 w-80`

  return (
    <section className="bg-white rounded-xs shadow-xs p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          Similar Doctors ({similarDoctors.length})
        </h3>
        {similarDoctors.length > itemsPerView && (
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="bg-white rounded-xs p-2 shadow-xs border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={scrollNext}
              className="bg-white rounded-xs p-2 shadow-xs border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {similarDoctors.map((doctor) => (
            <div key={doctor._id} className={classNames("flex-shrink-0", visibleSlidesClass)}>
              <DoctorCard doctor={doctor} branchName={doctor.branchName} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Similar Hospitals Carousel Component
const SimilarHospitalsCarousel = ({ hospitals, currentHospitalId }: { hospitals: any[], currentHospitalId: string }) => {
  const similarHospitals = hospitals
    .filter(h => h._id !== currentHospitalId)
    .slice(0, 6)

  if (similarHospitals.length === 0) return null

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps'
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const itemsPerView = 3
  const visibleSlidesClass = `min-w-0 w-80`

  return (
    <section className="bg-white rounded-xs shadow-xs p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Hospital className="w-5 h-5 text-gray-600" />
          Similar Hospitals ({similarHospitals.length})
        </h3>
        {similarHospitals.length > itemsPerView && (
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="bg-white rounded-xs p-2 shadow-xs border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={scrollNext}
              className="bg-white rounded-xs p-2 shadow-xs border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {similarHospitals.map((hospital) => {
            const hospitalImage = getHospitalImage(hospital.image)
            const hospitalSlug = hospital.slug || generateSlug(hospital.name)
            return (
              <div key={hospital._id} className={classNames("flex-shrink-0 bg-white rounded-xs shadow-xs p-0 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden", visibleSlidesClass)}>
                <HospitalCard hospital={hospital} hospitalImage={hospitalImage} hospitalSlug={hospitalSlug} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Hospital Card Component
const HospitalCard = ({ hospital, hospitalImage, hospitalSlug }: { hospital: any, hospitalImage: string | null, hospitalSlug: string }) => (
  <Link href={`/hospitals/${hospitalSlug}`} className="block group">
    <div className="relative w-full h-48 rounded-t-xs overflow-hidden bg-gray-50">
      {hospitalImage ? (
        <Image
          src={hospitalImage}
          alt={hospital.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <Hospital className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-5">
      <h5 className="font-semibold text-gray-900 text-base mb-2 line-clamp-1">{hospital.name}</h5>
      <p className="text-green-600 font-medium text-sm mb-2">{hospital.accreditation || 'Leading Provider'}</p>
      <p className="text-gray-600 text-xs mb-2">{hospital.beds || 'N/A'} Beds</p>
      {hospital.description && <p className="text-gray-500 text-xs line-clamp-2">{getShortabout(hospital.description)}</p>}
    </div>
  </Link>
)

// Skeleton Components
const HeroSkeleton = () => (
  <section className="relative w-full h-[70vh]">
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full z-10 px-6 pb-12 text-white">
      <div className="container mx-auto space-y-4">
        <div className="space-y-2">
          <div className="h-12 w-3/4 bg-white/10 rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </section>
)

const OverviewSkeleton = () => (
  <section className="bg-white rounded-xs shadow-xs p-4 border border-gray-100">
    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-24 w-full bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const CarouselSkeleton = ({ type }: { type: 'treatments' | 'hospitals' | 'doctors' }) => {
  const itemsPerView = 3
  const visibleSlidesClass = `min-w-0 w-80`

  return (
    <section className="bg-white rounded-xs shadow-xs p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-10 bg-gray-200 rounded animate-pulse ml-2" />
        </div>
        <div className="flex gap-2">
          <div className="bg-white rounded-xs p-2 shadow-xs border border-gray-200 animate-pulse" />
          <div className="bg-white rounded-xs p-2 shadow-xs border border-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-6">
          {Array.from({ length: Math.max(itemsPerView + 1, 6) }).map((_, i) => (
            <div key={i} className={classNames("flex-shrink-0 bg-white rounded-xs shadow-xs p-0 border border-gray-200 animate-pulse overflow-hidden", visibleSlidesClass)}>
              <div className="relative w-full h-40 bg-gray-100 rounded-t-xs" />
              <div className="p-5 space-y-2">
                <div className="h-5 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const SidebarSkeleton = () => (
  <aside className="lg:col-span-3 space-y-6">
    <div className="bg-white sticky top-24 rounded-xs shadow-xs p-4 border border-gray-100">
      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  </aside>
)

// Embla Carousel Component for Treatments
const EmblaCarouselTreatments = ({
  items,
  title,
  Icon
}: {
  items: any[],
  title: string,
  Icon: any
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps'
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const itemsPerView = 3
  const visibleSlidesClass = `min-w-0 w-80`

  return (
    <section className="bg-white rounded-xs shadow-xs p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          {title} ({items.length})
        </h3>
        {items.length > itemsPerView && (
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="bg-white rounded-xs p-2 shadow-xs border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={scrollNext}
              className="bg-white rounded-xs p-2 shadow-xs border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((item, index) => (
            <div key={item._id || index} className={classNames("flex-shrink-0 bg-white rounded-xs shadow-xs p-0 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden", visibleSlidesClass)}>
              <TreatmentCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Treatment Card Component
const TreatmentCard = ({ item }: { item: any }) => {
  const treatmentImage = getTreatmentImage(item.treatmentImage)
  const treatmentSlug = item.slug || generateSlug(item.name)

  return (
    <Link
      href={`/treatment/${treatmentSlug}`}
      className="group h-full flex flex-col hover:no-underline"
    >
      <div className="relative flex-1 min-h-40 rounded-t-xs overflow-hidden bg-gray-50">
        {treatmentImage ? (
          <Image
            src={treatmentImage}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Scissors className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h5 className="font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-gray-600 transition-colors duration-200">{item.name}</h5>
          {item.category && <p className="text-gray-600 font-medium text-xs line-clamp-1">{item.category}</p>}
          <p className="text-gray-500 text-xs line-clamp-2">{getShortabout(item.description) || "Comprehensive medical treatment."}</p>
        </div>
        {item.cost && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-gray-600 font-semibold text-xs">From ${item.cost}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

// Main Doctor Detail Component
export default function DoctorDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [doctor, setDoctor] = useState<any>(null)
  const [branch, setBranch] = useState<any>(null)
  const [hospital, setHospital] = useState<HospitalWithBranchPreview | null>(null)
  const [allHospitals, setAllHospitals] = useState<any[]>([])
  const [allDoctors, setAllDoctors] = useState<any[]>([])
  const [relatedTreatments, setRelatedTreatments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)

  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true)
      setError(null)
      try {
        const resolvedParams = await params
        const doctorSlug = resolvedParams.slug

        console.log('Fetching doctor with slug:', doctorSlug)

        const res = await fetch('/api/hospitals')
        if (!res.ok) throw new Error("Failed to fetch hospitals")
        const data = await res.json()

        if (data.items && data.items.length > 0) {
          let foundDoctor = null
          let foundBranch = null
          let foundHospital = null
          let treatments: any[] = []
          let allDoctorsLocal: any[] = []

          for (const hospitalItem of data.items) {
            const hospitalSlug = generateSlug(hospitalItem.name)
            if (hospitalItem.branches && hospitalItem.branches.length > 0) {
              for (const branchItem of hospitalItem.branches) {
                const branchNameSlug = generateSlug(branchItem.name)
                if (branchItem.doctors && branchItem.doctors.length > 0) {
                  for (const doctorItem of branchItem.doctors) {
                    const doctorNameSlug = generateSlug(doctorItem.name)
                    if (doctorNameSlug === doctorSlug) {
                      foundDoctor = doctorItem
                      foundBranch = branchItem
                      foundHospital = hospitalItem
                      treatments = branchItem.treatments || []
                      break
                    }
                    allDoctorsLocal.push({ ...doctorItem, branchName: branchItem.name })
                  }
                }
                if (foundDoctor) break
              }
            }
            if (foundDoctor) break
          }

          if (foundDoctor && foundHospital && foundBranch) {
            console.log('Found doctor:', foundDoctor.name)
            console.log('In branch:', foundBranch.name)
            console.log('In hospital:', foundHospital.name)
            console.log('Doctor about:', foundDoctor.about)
            setDoctor(foundDoctor)
            setBranch(foundBranch)
            setHospital(foundHospital)
            setRelatedTreatments(treatments)
            setAllHospitals(data.items)
            setAllDoctors(allDoctorsLocal)
          } else {
            throw new Error("Doctor not found")
          }
        } else {
          throw new Error("No hospitals available")
        }
      } catch (err) {
        console.error('Error fetching doctor:', err)
        setError(err instanceof Error ? err.message : "Failed to load doctor details")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorData()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeroSkeleton />
        <Breadcrumb hospitalName="Hospital Name" branchName="Branch Name" doctorName="Doctor Name" hospitalSlug="" />
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-6">
              <main className="lg:col-span-9 space-y-6">
                <OverviewSkeleton />
                <CarouselSkeleton type="treatments" />
                <CarouselSkeleton type="doctors" />
                <CarouselSkeleton type="hospitals" />
              </main>
              <SidebarSkeleton />
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error || !doctor || !hospital || !branch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <Breadcrumb hospitalName="Hospital Name" branchName="Branch Name" doctorName="Doctor Name" hospitalSlug="" />
        <div className="text-center space-y-6 max-w-md p-6 bg-white rounded-xs shadow-xs border border-gray-200">
          <Stethoscope className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">Doctor Not Found</h2>
          <p className="text-gray-600 leading-relaxed">{error || "The requested doctor could not be found. Please check the URL or try searching again."}</p>
          <Link
            href="/hospitals"
            className="inline-block w-full bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors font-semibold"
          >
            Go to Hospital Search
          </Link>
        </div>
      </div>
    )
  }

  const doctorImage = getDoctorImage(doctor.profileImage)
  const hospitalImage = getHospitalImage(hospital.image)
  const heroImage = doctorImage || hospitalImage
  const hospitalSlug = hospital.slug || generateSlug(hospital.name)
  const branchSlug = generateSlug(branch.name)

  const hasAboutContent = doctor.about && (
    (typeof doctor.about === 'string' && doctor.about.trim()) ||
    (doctor.about.nodes && doctor.about.nodes.length > 0)
  )

  const plainAbout = hasAboutContent ? getPlainText(doctor.about) : ''
  const isLongAbout = plainAbout.length > 200

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full bg-gray-100 h-[70vh]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${doctor.name} profile`}
            fill
            priority
            className="object-contain  object-right"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" /> */}
        <div className="absolute md:w-1/2 bottom-0 left-0 w-full z-10 px-6 pb-12 text-gray-700">
          <div className="container mx-auto space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {doctor.name}
            </h1>
            <p className="text-lg max-w-2xl leading-relaxed text-gray-700">
              {doctor.specialization} - {doctor.qualification} at {hospital.name}, {branch.name}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {doctor.designation && (
                <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md text-sm font-medium">
                  <Users className="w-4 h-4" />
                  {doctor.designation}
                </span>
              )}
             
            </div>
          </div>
        </div>
      </section>
      <Breadcrumb hospitalName={hospital.name} branchName={branch.name} doctorName={doctor.name} hospitalSlug={hospitalSlug} />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-6">
            <main className="lg:col-span-9 space-y-6">
              <section className="bg-white rounded-xs shadow-xs p-4 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Doctor Profile</h2>
                <div className="space-y-6">
                  {hasAboutContent && (
                    <div className="relative">
                      <div className={`prose prose-lg max-w-none ${!isAboutExpanded ? 'line-clamp-4 overflow-hidden relative' : ''}`}>
                        {renderRichText(doctor.about)}
                        {!isAboutExpanded && isLongAbout && (
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}
                      </div>
                      {isLongAbout && (
                        <button 
                          onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                          className="mt-3 inline-flex items-center gap-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          {isAboutExpanded ? 'Read Less' : 'Read More'} 
                          <ChevronRight className={`w-4 h-4 transition-transform ${isAboutExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}
                  {!hasAboutContent && doctor.about && (
                    <p className="text-gray-500 italic">No detailed information available.</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    {doctor.specialization && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">Specialization</p>
                          <p className="text-gray-600 text-sm">{doctor.specialization}</p>
                        </div>
                      </div>
                    )}
                    {doctor.qualification && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <Award className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Qualification</p>
                          <p className="text-gray-600 text-sm">{doctor.qualification}</p>
                        </div>
                      </div>
                    )}
                    {doctor.designation && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <Users className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Designation</p>
                          <p className="text-gray-600 text-sm">{doctor.designation}</p>
                        </div>
                      </div>
                    )}
                    {doctor.experience && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Experience</p>
                          <p className="text-gray-600 text-sm">{doctor.experience} years</p>
                        </div>
                      </div>
                    )}
                    {doctor.contactNumber && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Contact</p>
                          <p className="text-gray-600 font-semibold text-sm">{doctor.contactNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {relatedTreatments && relatedTreatments.length > 0 && (
                <EmblaCarouselTreatments
                  items={relatedTreatments}
                  title="Treatments Offered"
                  Icon={Scissors}
                />
              )}

              <SimilarDoctorsCarousel doctors={allDoctors} currentDoctorId={doctor._id} />

              <SimilarHospitalsCarousel hospitals={allHospitals} currentHospitalId={hospital._id} />
            </main>

            <aside className="lg:col-span-3 space-y-6">
              <ContactForm />
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
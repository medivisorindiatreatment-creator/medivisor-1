// Shared utilities for search-related pages
// Extracted from treatment, doctor, and hospital slug pages for reusability

// Define interfaces based on actual usage in the code
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
  popular?: boolean
  locations: { hospitalName: string; hospitalId: string; branchName?: string; branchId?: string; cities: City[] }[]
  departments: Department[]
  relatedTreatments?: any[]
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

// Image utilities
export const getWixImageUrl = (imageStr: string | null | undefined): string | null => {
  if (!imageStr || typeof imageStr !== "string" || !imageStr.startsWith("wix:image://v1/")) return null
  const parts = imageStr.split("/")
  return parts.length >= 4 ? `https://static.wixstatic.com/media/${parts[3]}` : null
}

export const getDoctorImage = (imageData: any): string | null => getWixImageUrl(imageData)
export const getTreatmentImage = (imageData: any): string | null => getWixImageUrl(imageData)
export const getHospitalImage = (imageData: any): string | null => getWixImageUrl(imageData)
export const getBranchImage = (imageData: any): string | null => getWixImageUrl(imageData)
export const getHospitalLogo = (logo: any): string | null => getWixImageUrl(logo)

// Slug generation
export const generateSlug = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string') return ''
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

// Content processing
export const getShortDescription = (richContent: any, maxLength: number = 100): string => {
  if (typeof richContent === 'string') {
    const text = richContent.replace(/<[^>]*>/g, '').trim()
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  if (!richContent?.nodes) return ''
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

export const getContentImage = (content: any): string | null => {
  if (typeof content === 'string') return getWixImageUrl(content)
  if (!content || !content.nodes) return null
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE')
  if (imageNode?.imageData?.image?.src?.id) {
    return `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`
  }
  return null
}

// Hospital name cleaning
export const cleanHospitalName = (name: string | null | undefined): string => {
  return (name || '').replace(' Group', '').trim() || 'N/A'
}

// Data aggregation utilities
export const mergeTreatments = (existing: Treatment[] | undefined, current: Treatment[] | undefined): Treatment[] => {
  const allTreatments = [...(existing || []), ...(current || [])]
  const treatmentMap = new Map<string, Treatment>()
  allTreatments.forEach(t => {
    if (t._id) {
      treatmentMap.set(t._id, t)
    }
  })
  return Array.from(treatmentMap.values())
}

export const getAllExtendedTreatments = (hospitals: Hospital[]): Treatment[] => {
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
      const location = {
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
          const hasThisTreatment = spec.treatments?.some((t: any) => t._id === item._id)
          if (hasThisTreatment && spec.department) treatmentDepartments.push(...spec.department)
        })
        processTreatment(item, b, treatmentDepartments)
      })
    })
  })
  return Array.from(extended.values())
}

export const getAllExtendedDoctors = (hospitals: Hospital[]): Doctor[] => {
  const extendedMap = new Map<string, Doctor>()

  hospitals.forEach((h) => {
    const processDoctor = (item: any, branch?: Branch) => {
      const baseId = item._id || item.doctorName

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

      let treatmentsFromThisLocation: Treatment[] = []

      treatmentsFromThisLocation = mergeTreatments(
        branch?.treatments,
        h.treatments
      )

      const doctorTreatments = item.specialization?.flatMap((spec: any) => spec.treatments || []) || []
      treatmentsFromThisLocation = mergeTreatments(treatmentsFromThisLocation, doctorTreatments)

      const doctorSpecNames = item.specialization?.map((s: any) => typeof s === 'string' ? s : s.name).filter(Boolean) || []
      ;(h as any).specialists?.forEach((spec: any) => {
        if (doctorSpecNames.includes(spec.name)) {
          treatmentsFromThisLocation = mergeTreatments(treatmentsFromThisLocation, spec.treatments)
        }
      })

      ;(branch as any)?.specialists?.forEach((spec: any) => {
        if (doctorSpecNames.includes(spec.name)) {
          treatmentsFromThisLocation = mergeTreatments(treatmentsFromThisLocation, spec.treatments)
        }
      })

      if (extendedMap.has(baseId)) {
        const existingDoctor = extendedMap.get(baseId)!

        const isLocationDuplicate = existingDoctor.locations.some(
          (loc: any) => loc.hospitalId === h._id && (loc.branchId === branch?._id || (!loc.branchId && !branch?._id))
        )
        if (!isLocationDuplicate) {
          existingDoctor.locations.push(location)
        }

        const allDepts = [...existingDoctor.departments, ...uniqueDepartments]
        existingDoctor.departments = Array.from(new Map(allDepts.map(dept => [dept._id, dept])).values())

        existingDoctor.relatedTreatments = mergeTreatments(existingDoctor.relatedTreatments, treatmentsFromThisLocation)

      } else {
        extendedMap.set(baseId, {
          ...item,
          baseId,
          locations: [location],
          departments: uniqueDepartments,
          relatedTreatments: treatmentsFromThisLocation,
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

// Filter utilities
export interface FilterValue {
  id: string
  query: string
}

export type FilterKey = 'city' | 'branch' | 'treatment' | 'doctor'

export type Filters = {
  [K in FilterKey]: FilterValue
}

export const enforceOnePrimaryFilter = (key: FilterKey, prevFilters: Filters, newFilterValue: FilterValue): Filters => {
  let newFilters = { ...prevFilters, [key]: newFilterValue }
  const primaryKeys: FilterKey[] = ['doctor', 'treatment', 'branch']
  if (primaryKeys.includes(key) && (newFilterValue.id || newFilterValue.query)) {
    primaryKeys.forEach(primaryKey => {
      if (primaryKey !== key) {
        newFilters[primaryKey] = { id: '', query: '' }
      }
    })
  }
  return newFilters
}
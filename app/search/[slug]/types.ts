// Define the type locally if not available from '@/types/hospital'
export type HospitalWithBranchPreview = {
  _id: string
  hospitalName: string
  slug?: string
  hospitalImage?: string | null
  logo?: string | null
  yearEstablished?: number
  description?: string
  branches?: Array<{
    _id: string
    branchName: string
    branchImage?: string | null
    logo?: string | null
    isMain?: boolean
    city?: Array<{ name?: string; cityName?: string }>
    totalBeds?: number
    yearEstablished?: number
    doctors?: any[]
    noOfDoctors?: string
    treatments?: any[]
    accreditation?: any[]
  }>
  accreditations?: any[]
}

export interface AccreditationType {
  _id: string
  name: string
  description: string | null
  image: string | null
  issuingBody: string | null
  year: string | null
  title: string
}

export type HospitalWithBranchPreviewExtended = HospitalWithBranchPreview & {
  accreditations?: AccreditationType[]
  city?: string
}

export interface HospitalApiResponse {
  items: HospitalWithBranchPreview[]
}
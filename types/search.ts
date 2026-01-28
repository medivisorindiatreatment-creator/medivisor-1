export const getWixImageUrl = (imageStr: string | null | undefined): string | null => {
  if (!imageStr || typeof imageStr !== "string" || !imageStr.startsWith("wix:image://v1/")) return null
  const parts = imageStr.split("/")
  return parts.length >= 4 ? `https://static.wixstatic.com/media/${parts[3]}` : null
}

export const generateSlug = (name: string | null | undefined): string => {
  return (name ?? '').toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
}

export const isUUID = (str: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)
}

// Helper function to format location: "City, State, Country"
// All data is fetched from Wix CMS and normalized (Delhi NCR cities show "Delhi NCR" as state)
export const formatLocation = (city: CityType | null | undefined): string => {
  if (!city) return "Location not specified"

  const cityName = (city.cityName || "").trim()
  const state = (city.state || "").trim()
  const country = (city.country || "").trim()

  // Format: "City, State, Country"
  const parts: string[] = []
  if (cityName) parts.push(cityName)
  if (state) parts.push(state)
  if (country) parts.push(country)

  return parts.length > 0 ? parts.join(", ") : "Location not specified"
}

export interface BaseItem {
  _id: string;
  name?: string;
  title?: string;
  doctorName?: string;
  popular?: boolean
}

export interface SpecialtyType extends BaseItem {
  name: string;
  title?: string;
  department?: DepartmentType[] | null
}

export interface DepartmentType extends BaseItem {
  name: string
}

export interface AccreditationType extends BaseItem {
  title: string;
  image: string | null
}

export interface CityType {
  _id: string;
  cityName: string;
  state: string | null;
  country: string | null
}

export interface TreatmentType extends BaseItem {
  name: string;
  description: string | null;
  category: string | null;
  duration: string | null;
  cost: string | null;
  treatmentImage?: string | null
}

export interface DoctorType extends BaseItem {
  doctorName: string;
  specialization: SpecialtyType[] | string[] | string | null;
  qualification: string | null;
  experienceYears: string | null;
  designation: string | null;
  aboutDoctor: string | null;
  profileImage: string | null
}

export interface ExtendedDoctorType extends DoctorType {
  baseId: string;
  locations: {
    hospitalName: string;
    hospitalId: string;
    branchName?: string;
    branchId?: string;
    cities: CityType[]
  }[];
  departments: DepartmentType[];
  filteredLocations?: {
    hospitalName: string;
    hospitalId: string;
    branchName?: string;
    branchId?: string;
    cities: CityType[]
  }[];
}

export interface TreatmentLocation {
  branchId?: string;
  branchName?: string;
  hospitalName: string;
  hospitalId: string;
  cities: CityType[];
  departments: DepartmentType[];
  cost: string | null;
}

export interface ExtendedTreatmentType extends TreatmentType {
  branchesAvailableAt: TreatmentLocation[];
  departments: DepartmentType[];
  filteredBranchesAvailableAt?: TreatmentLocation[];
}

export interface BranchSpecialist {
  _id: string;
  name: string;
  department: DepartmentType[];
  treatments: TreatmentType[]
}

export interface BranchType extends BaseItem {
  branchName: string;
  address: string | null;
  city: CityType[];
  totalBeds: string | null;
  noOfDoctors: string | null;
  yearEstablished: string | null;
  branchImage: string | null;
  description: string | null;
  doctors: DoctorType[];
  treatments: TreatmentType[];
  specialists: BranchSpecialist[];
  specialization: SpecialtyType[];
  accreditation: AccreditationType[]
}

export interface HospitalType extends BaseItem {
  hospitalName: string;
  logo: string | null;
  yearEstablished: string | null;
  description: string | null;
  branches: BranchType[];
  doctors: DoctorType[];
  treatments: TreatmentType[];
  departments?: DepartmentType[];
  showHospital?: boolean;
}

export interface ApiResponse {
  items: HospitalType[];
  total: number
}

export type FilterKey = "city" | "state" | "treatment" | "specialization" | "department" | "doctor" | "branch" | "location"

export interface FilterValue {
  id: string;
  query: string
}

export interface FilterState {
  view: "hospitals" | "doctors" | "treatments"
  city: FilterValue
  state: FilterValue
  treatment: FilterValue
  specialization: FilterValue
  department: FilterValue
  doctor: FilterValue
  branch: FilterValue
  location: FilterValue
  sortBy: "all" | "popular" | "az" | "za"
}

export type OptionType = { id: string; name: string }
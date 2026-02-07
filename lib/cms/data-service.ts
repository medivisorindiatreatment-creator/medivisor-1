// lib/cms/data-service.ts
// Optimized CMS data fetching with proper multi-reference mapping and caching

import { wixClient } from '@/lib/wixClient'
import { memoryCache, CACHE_CONFIG } from './cache'
import type {
  HospitalData,
  BranchData,
  DoctorData,
  TreatmentData,
  CityData,
  ExtendedTreatmentData,
  CMSDataResponse,
  HospitalDetailResponse,
  TreatmentLocation,
} from './types'

// Cache version - increment to clear cache
const CACHE_VERSION = 1
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// =============================================================================
// COLLECTION NAMES
// =============================================================================

const COLLECTIONS = {
  BRANCHES: 'BranchesMaster',
  DOCTORS: 'DoctorMaster',
  CITIES: 'CityMaster',
  HOSPITALS: 'HospitalMaster',
  ACCREDITATIONS: 'Accreditation',
  SPECIALTIES: 'SpecialistsMaster',
  DEPARTMENTS: 'Department',
  TREATMENTS: 'TreatmentMaster',
  STATES: 'StateMaster',
} as const

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getValue(item: any, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = item?.[key] ?? item?.data?.[key]
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string') return value
      if (typeof value === 'object') {
        return value.name || value.title || value.state || value.State || 
               value.stateName || value['State Name'] || null
      }
      return String(value)
    }
  }
  return null
}

function extractMultiReference(field: any, ...nameKeys: string[]): any[] {
  if (!field) return []
  const items = Array.isArray(field) ? field : [field]
  return items.filter(Boolean).map((ref: any) => {
    if (typeof ref === 'string') return { _id: ref, name: 'ID Reference' }
    if (typeof ref === 'object') {
      let name = 'Unknown'
      for (const key of nameKeys) {
        if (ref[key]) { name = ref[key]; break }
      }
      const id = ref._id || ref.ID
      return id ? { _id: id, name, ...ref } : null
    }
    return null
  }).filter(Boolean)
}

// =============================================================================
// MAPPING FUNCTIONS
// =============================================================================

function mapCity(item: any, stateMap: Record<string, { _id: string; name: string }>): CityData {
  const cityName = getValue(item, 'cityName', 'city name', 'name', 'City Name') || 'Unknown City'
  let state = 'Unknown State'
  let stateId: string | undefined = undefined
  
  const stateRef = item.state || item.State || item.stateRef || item.stateMaster
  if (stateRef) {
    if (Array.isArray(stateRef) && stateRef[0]) {
      state = getValue(stateRef[0], 'state', 'State Name', 'name', 'title') || 'Unknown State'
      stateId = stateRef[0]._id || stateRef[0].ID
    } else if (typeof stateRef === 'object') {
      state = getValue(stateRef, 'state', 'State Name', 'name', 'title') || 'Unknown State'
      stateId = stateRef._id || stateRef.ID
    } else if (typeof stateRef === 'string' && stateMap[stateRef]) {
      state = stateMap[stateRef].name
      stateId = stateRef
    }
  }
  
  return {
    _id: item._id || item.ID,
    cityName,
    state,
    stateId,
    country: getValue(item, 'country', 'Country Name') || 'India',
  }
}

function mapTreatment(item: any): TreatmentData {
  return {
    _id: item._id || item.ID,
    name: getValue(item, 'treatmentName', 'Treatment Name', 'title', 'name') || 'Unknown Treatment',
    description: item.description || item.Description || '',
    category: getValue(item, 'category', 'Category'),
    duration: getValue(item, 'duration', 'Duration'),
    cost: getValue(item, 'cost', 'Cost', 'averageCost'),
    treatmentImage: item.treatmentImage || null,
    popular: getValue(item, 'popular') === 'true',
  }
}

function mapDoctor(item: any): DoctorData {
  return {
    _id: item._id || item.ID,
    doctorName: getValue(item, 'doctorName', 'Doctor Name') || 'Unknown Doctor',
    specialization: extractMultiReference(item.specialization, 'specialty', 'Specialty Name', 'title', 'name'),
    qualification: getValue(item, 'qualification', 'Qualification'),
    experienceYears: getValue(item, 'experienceYears', 'Experience (Years)'),
    designation: getValue(item, 'designation', 'Designation'),
    aboutDoctor: item.aboutDoctor || item.data?.aboutDoctor || '',
    profileImage: item.profileImage || null,
    popular: getValue(item, 'popular') === 'true',
  }
}

function isStandaloneBranch(branch: any): boolean {
  const hasHospitalGroup = branch.HospitalMaster_branches || branch.hospitalGroup || branch['Hospital Group Master']
  const hasDirectHospital = branch.hospital || branch.HospitalMaster_branches
  return !hasHospitalGroup && !hasDirectHospital
}

function mapBranch(item: any): BranchData {
  return {
    _id: item._id || item.ID,
    branchName: getValue(item, 'branchName', 'Branch Name') || 'Unknown Branch',
    address: getValue(item, 'address', 'Address'),
    city: extractMultiReference(item.city, 'cityName', 'city name', 'name'),
    specialty: extractMultiReference(item.specialty, 'specialization', 'Specialty Name', 'title', 'name'),
    accreditation: extractMultiReference(item.accreditation, 'title', 'Title'),
    description: item.description || item.data?.description || '',
    totalBeds: getValue(item, 'totalBeds', 'Total Beds'),
    noOfDoctors: getValue(item, 'noOfDoctors', 'No of Doctors'),
    yearEstablished: getValue(item, 'yearEstablished'),
    branchImage: item.branchImage || null,
    logo: item.logo || null,
    doctors: extractMultiReference(item.doctor, 'doctorName', 'Doctor Name'),
    specialists: extractMultiReference(item.specialist, 'specialty', 'Specialty Name', 'title', 'name'),
    treatments: extractMultiReference(item.treatment, 'treatmentName', 'Treatment Name', 'title', 'name'),
    specialization: [
      ...extractMultiReference(item.specialty, 'specialization', 'Specialty Name', 'title', 'name'),
      ...extractMultiReference(item.treatment, 'treatmentName', 'Treatment Name', 'title', 'name').map((t) => ({
        ...t,
        isTreatment: true,
      })),
    ],
    popular: getValue(item, 'popular') === 'true',
    isStandalone: isStandaloneBranch(item),
    showHospital: getValue(item, 'ShowHospital', 'showHospital') === 'true',
  }
}

function mapHospital(item: any, isFromBranch = false): HospitalData {
  if (isFromBranch) {
    return {
      _id: `standalone-${item._id || item.ID}`,
      hospitalName: getValue(item, 'branchName', 'hospitalName', 'Hospital Name') || 'Unknown Hospital',
      description: item.description || item.data?.description || '',
      specialty: extractMultiReference(item.specialty, 'specialization', 'Specialty Name', 'title', 'name'),
      yearEstablished: getValue(item, 'yearEstablished'),
      hospitalImage: item.branchImage || null,
      logo: item.logo || null,
      isStandalone: true,
      originalBranchId: item._id || item.ID,
      branches: [],
      doctors: [],
      specialists: [],
      treatments: [],
      accreditations: [],
      showHospital: true,
    }
  }
  return {
    _id: item._id || item.ID,
    hospitalName: getValue(item, 'hospitalName', 'Hospital Name') || 'Unknown Hospital',
    description: item.description || item.data?.description || '',
    specialty: extractMultiReference(item.specialty, 'specialization', 'Specialty Name', 'title', 'name'),
    yearEstablished: getValue(item, 'yearEstablished'),
    hospitalImage: item.hospitalImage || null,
    logo: item.logo || null,
    isStandalone: false,
    branches: [],
    doctors: [],
    specialists: [],
    treatments: [],
    accreditations: [],
    showHospital: true,
  }
}

// =============================================================================
// MAIN DATA SERVICE
// =============================================================================

export async function getAllCMSData(): Promise<CMSDataResponse> {
  const cacheKey = `cms_all_v${CACHE_VERSION}`
  const cached = memoryCache.get<CMSDataResponse>(cacheKey)
  if (cached) return cached

  return memoryCache.dedupe(cacheKey, async () => {
    // Fetch all collections in parallel
    const [rawCities, rawStates, rawTreatments, rawSpecialties, rawBranches, rawHospitals] = await Promise.all([
      wixClient.items.query(COLLECTIONS.CITIES).include('state', 'State').find().then(r => r.items),
      wixClient.items.query(COLLECTIONS.STATES).find().then(r => r.items),
      wixClient.items.query(COLLECTIONS.TREATMENTS).include('branches', 'hospital', 'city').limit(2000).find().then(r => r.items),
      wixClient.items.query(COLLECTIONS.SPECIALTIES).include('treatment', 'department', 'hospital', 'branch').limit(2000).find().then(r => r.items),
      wixClient.items.query(COLLECTIONS.BRANCHES).include('hospital', 'city', 'doctor', 'specialty', 'treatment', 'specialist').limit(2000).find().then(r => r.items),
      wixClient.items.query(COLLECTIONS.HOSPITALS).include('specialty').limit(2000).find().then(r => r.items),
    ])

    // Build state map
    const stateMap: Record<string, { _id: string; name: string }> = {}
    rawStates.forEach((item: any) => {
      const id = item._id || item.ID
      const name = getValue(item, 'state', 'State Name', 'name', 'title') || 'Unknown State'
      if (id) stateMap[id] = { _id: id, name }
    })

    // Map cities with state info
    const cities = rawCities.map((c: any) => mapCity(c, stateMap))

    // Map treatments
    const treatments = rawTreatments.map((t: any) => mapTreatment(t))

    // Create lookup maps for fast resolution
    const treatmentMap = new Map(treatments.map(t => [t._id, t]))

    // Process branches and build relationships
    const hospitalBranches = new Map<string, any[]>()
    const standaloneBranches: any[] = []
    const treatmentToBranches = new Map<string, Set<string>>()
    const branchToTreatments = new Map<string, Set<string>>()

    rawBranches.forEach((branch: any) => {
      const branchId = branch._id || branch.ID
      if (!branchId) return

      // Check if standalone
      if (isStandaloneBranch(branch)) {
        standaloneBranches.push(branch)
      } else {
        // Get hospital IDs
        const hospitalIds = [
          branch.hospital,
          ...(branch.HospitalMaster_branches || []),
        ].filter(Boolean).map((h: any) => typeof h === 'string' ? h : h._id || h.ID)

        hospitalIds.forEach(hid => {
          if (!hospitalBranches.has(hid)) hospitalBranches.set(hid, [])
          hospitalBranches.get(hid)!.push(branch)
        })
      }

      // Build treatment relationships from branch
      const branchTreatments = [
        ...(branch.treatment || []),
        ...(branch.specialist || []).flatMap((s: any) => s.treatment || []),
      ]
      branchTreatments.forEach((t: any) => {
        const treatmentId = t._id || t.ID || t
        if (treatmentId) {
          if (!treatmentToBranches.has(treatmentId)) treatmentToBranches.set(treatmentId, new Set())
          treatmentToBranches.get(treatmentId)!.add(branchId)
          if (!branchToTreatments.has(branchId)) branchToTreatments.set(branchId, new Set())
          branchToTreatments.get(branchId)!.add(treatmentId)
        }
      })
    })

    // Build hospitals with branches and treatments
    const hospitals: HospitalData[] = rawHospitals.map((h: any) => {
      const hospitalId = h._id || h.ID
      const branches = hospitalBranches.get(hospitalId) || []
      
      // Collect all treatments from all branches
      const hospitalTreatments = new Set<string>()
      branches.forEach((b: any) => {
        const bId = b._id || b.ID
        if (branchToTreatments.has(bId)) {
          branchToTreatments.get(bId)!.forEach(tId => hospitalTreatments.add(tId))
        }
      })

      return {
        ...mapHospital(h),
        branches: branches.map(mapBranch),
        doctors: branches.flatMap((b: any) => (b.doctor || []).filter(Boolean).map(mapDoctor)),
        specialists: branches.flatMap((b: any) => (b.specialist || []).filter(Boolean)),
        treatments: Array.from(hospitalTreatments).map(id => treatmentMap.get(id)).filter(Boolean) as TreatmentData[],
      }
    })

    // Add standalone branches as hospitals
    standaloneBranches.forEach(branch => {
      const branchId = branch._id || branch.ID
      const hospitalTreatments = new Set<string>()
      
      // Get treatments from branch
      if (branchToTreatments.has(branchId)) {
        branchToTreatments.get(branchId)!.forEach(tId => hospitalTreatments.add(tId))
      }

      hospitals.push({
        ...mapHospital(branch, true),
        branches: [mapBranch(branch)],
        doctors: (branch.doctor || []).filter(Boolean).map(mapDoctor),
        specialists: (branch.specialist || []).filter(Boolean),
        treatments: Array.from(hospitalTreatments).map(id => treatmentMap.get(id)).filter(Boolean) as TreatmentData[],
      })
    })

    // Build extended treatments with branch availability
    const extendedTreatments: ExtendedTreatmentData[] = treatments.map(treatment => {
      const branchIds = treatmentToBranches.get(treatment._id) || new Set<string>()
      const branches: TreatmentLocation[] = []

      hospitalBranches.forEach((hBranches, hospitalId) => {
        const hospital = rawHospitals.find((h: any) => (h._id || h.ID) === hospitalId)
        if (!hospital) return

        const hospitalName = getValue(hospital, 'hospitalName', 'Hospital Name') || ''

        hBranches.forEach(b => {
          const bId = b._id || b.ID
          if (branchIds.has(bId)) {
            const city = b.city?.[0]?.cityName || b.city?.cityName || ''
            branches.push({
              branchId: bId,
              branchName: getValue(b, 'branchName', 'Branch Name') || '',
              hospitalId,
              hospitalName,
              city,
              departments: [],
            })
          }
        })
      })

      return {
        ...treatment,
        branchesAvailableAt: branches,
        departments: [],
      }
    })

    const response: CMSDataResponse = {
      hospitals,
      treatments: extendedTreatments,
      totalHospitals: hospitals.length,
      totalTreatments: extendedTreatments.length,
      lastUpdated: new Date().toISOString(),
    }

    memoryCache.set(cacheKey, response, CACHE_DURATION)
    return response
  })
}

// =============================================================================
// HOSPITAL BY SLUG
// =============================================================================

export async function getHospitalBySlug(slug: string): Promise<HospitalDetailResponse> {
  const cacheKey = `hospital_slug_${slug}`
  const cached = memoryCache.get<HospitalDetailResponse>(cacheKey)
  if (cached) return cached

  return memoryCache.dedupe(cacheKey, async () => {
    const { hospitals } = await getAllCMSData()
    const slugLower = slug.toLowerCase()

    // Find hospital by slug
    const hospital = hospitals.find(h => {
      const hospitalSlug = (h.hospitalName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      if (hospitalSlug === slugLower) return true
      return h.branches.some(b => {
        const branchSlug = (b.branchName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return branchSlug === slugLower
      })
    })

    if (!hospital) {
      return { hospital: null, similarHospitals: [], error: 'Hospital not found' }
    }

    // Find similar hospitals
    const similarHospitals = hospitals
      .filter(h => h._id !== hospital._id)
      .filter(h => h.specialty.some(s => 
        hospital.specialty.some(hs => s._id === hs._id)
      ))
      .slice(0, 3)

    const result = { hospital, similarHospitals }
    memoryCache.set(cacheKey, result, CACHE_DURATION)
    return result
  })
}

// =============================================================================
// TREATMENT BY SLUG
// =============================================================================

export async function getTreatmentBySlug(slug: string): Promise<ExtendedTreatmentData | null> {
  const { treatments } = await getAllCMSData()
  const slugLower = slug.toLowerCase()
  
  return treatments.find(t => {
    const treatmentSlug = (t.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return treatmentSlug === slugLower
  }) || null
}

// =============================================================================
// SEARCH HOSPITALS
// =============================================================================

export async function searchHospitals(query: string): Promise<HospitalData[]> {
  const { hospitals } = await getAllCMSData()
  if (!query) return hospitals

  const queryLower = query.toLowerCase()
  return hospitals.filter(h => {
    const searchFields = [
      h.hospitalName,
      ...h.branches.map(b => b.branchName),
      ...h.branches.flatMap(b => b.city.map(c => c.cityName)),
      ...h.specialty.map(s => s.name),
      ...h.treatments.map(t => t.name),
    ].filter(Boolean).join(' ').toLowerCase()
    
    return searchFields.includes(queryLower) || searchFields.includes(queryLower.replace(/-/g, ' '))
  })
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function generateSlug(name: string | null | undefined): string {
  return (name ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Cache management
export function clearCMSCache() {
  memoryCache.clear()
}

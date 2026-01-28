// app/api/hospitals/query-builder.ts
// Query building logic for hospitals API

import { wixClient } from "@/lib/wixClient"
import { COLLECTIONS } from './collections'
import { ReferenceMapper } from './mappers'
import type { HospitalFilters } from './types'

/**
 * Gets hospital IDs based on filters
 */
export async function getHospitalIds(filters: HospitalFilters): Promise<string[]> {
  let { branchIds, cityIds, doctorIds, specialtyIds, accreditationIds, treatmentIds, specialistIds, departmentIds } =
    filters
  if (
    !branchIds?.length &&
    !cityIds?.length &&
    !doctorIds?.length &&
    !specialtyIds?.length &&
    !accreditationIds?.length &&
    !treatmentIds?.length &&
    !specialistIds?.length &&
    !departmentIds?.length
  )
    return []

  if (departmentIds?.length) {
    const res = await wixClient.items
      .query(COLLECTIONS.SPECIALTIES)
      .hasSome("department", departmentIds)
      .limit(500)
      .find()
    const addIds = res.items.map((i) => i._id).filter(Boolean)
    specialistIds = [...(specialistIds || []), ...addIds]
  }

  const query = wixClient.items
    .query(COLLECTIONS.BRANCHES)
    .include(
      "hospital",
      "HospitalMaster_branches",
      "city",
      "doctor",
      "specialty",
      "accreditation",
      "treatment",
      "specialist",
    )

  if (branchIds?.length) query.hasSome("_id", branchIds)
  if (cityIds?.length) query.hasSome("city", cityIds)
  if (doctorIds?.length) query.hasSome("doctor", doctorIds)
  if (specialtyIds?.length) query.hasSome("specialty", specialtyIds)
  if (accreditationIds?.length) query.hasSome("accreditation", accreditationIds)
  if (treatmentIds?.length) query.hasSome("treatment", treatmentIds)
  if (specialistIds?.length) query.hasSome("specialist", specialistIds)

  const result = await query.limit(1000).find()
  const hospitalIds = new Set<string>()
  result.items.forEach((b: any) => ReferenceMapper.extractHospitalIds(b).forEach((id) => hospitalIds.add(id)))
  return Array.from(hospitalIds)
}
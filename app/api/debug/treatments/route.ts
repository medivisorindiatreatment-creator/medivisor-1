// Detailed debug endpoint for treatment data
import { getAllCMSData } from "@/lib/cms"

export async function GET() {
  try {
    const { treatments, hospitals } = await getAllCMSData()
    
    const debugInfo = {
      summary: {
        totalTreatments: treatments.length,
        totalHospitals: hospitals.length,
      },
      // Check first hospital's first branch treatments
      hospitalAnalysis: hospitals.slice(0, 3).map((h) => ({
        hospitalName: h.hospitalName,
        branchesCount: h.branches?.length || 0,
        branches: h.branches?.slice(0, 2).map((b) => ({
          branchName: b.branchName,
          treatmentsCount: b.treatments?.length || 0,
          treatments: b.treatments?.map((t) => ({
            _id: t._id,
            name: t.name,
            cost: t.cost,
          })) || [],
          specialistsCount: b.specialists?.length || 0,
          specialists: b.specialists?.slice(0, 2).map((s) => ({
            _id: s._id,
            name: s.name,
            treatmentsCount: s.treatments?.length || 0,
            treatments: s.treatments?.map((t) => ({
              _id: t._id,
              name: t.name,
            })) || [],
          })) || [],
        })) || [],
      })),
      // Check treatments with their branches
      treatmentAnalysis: treatments.slice(0, 5).map((t) => ({
        _id: t._id,
        name: t.name,
        departments: t.departments,
        branchesCount: t.branchesAvailableAt?.length || 0,
        branches: t.branchesAvailableAt?.slice(0, 3),
      })),
    }
    
    return Response.json(debugInfo, { headers: { "Cache-Control": "no-cache" } })
  } catch (error) {
    console.error("Debug error:", error)
    return Response.json({ error: String(error), stack: (error as Error).stack }, { status: 500 })
  }
}

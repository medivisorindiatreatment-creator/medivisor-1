// app/api/hospitals/route.ts
import { wixServerClient } from "@/lib/wixServer";
import type { NextRequest } from "next/server";

// --- Collection IDs (CityMaster re-added) ---
const COLLECTION_IDS = {
  HOSPITALS: "HospitalList",
  BRANCHES: "hospitalbrancheslist",
  CITIES: "CityMaster", // Re-added City collection
};

const DEFAULT_LIMIT = 50;

// --- Type Definitions (Updated for City) ---
interface City {
  _id: string;
  cityName: string;
}

interface Branch {
  _id: string;
  branchName: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  branchImageUrl: string;
  primaryLocation: City[]; // Added city information
}

interface Hospital {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  branches: Branch[];
  branchCount: number;
}

// ----------------------------------------------------------------------
// Helper to map city data (Re-added)
// ----------------------------------------------------------------------
function mapCityData(city: any): City | null {
  if (!city) return null;

  return {
    _id: city._id,
    cityName: city["city name"] || city.cityName || city.name || "Unknown City",
  };
}

// ----------------------------------------------------------------------
// Helper to map branch data (Updated to include city - FIX APPLIED HERE)
// ----------------------------------------------------------------------
function mapBranchData(branch: any): Branch | null {
  if (!branch) return null;

  // Map the primary location (city) data from the multi-reference field
  let primaryLocationsData: City[] = [];
  
  // *** FIX: Robust check for the primaryLocation field key/casing ***
  const rawLocations = 
    branch.primaryLocation ||        // Standard camelCase (often used when including references)
    branch["primary Location"] ||    // Original field name with space
    branch.primarylocation ||        // Lowercase variation (as a safe fallback)
    [];                              // Default to an empty array
    
  if (Array.isArray(rawLocations)) {
    // If the reference is loaded, rawLocations will be an array of city objects.
    // If the reference failed to load or is empty, it will be an empty array.
    primaryLocationsData = rawLocations
      .map(mapCityData)
      .filter((c): c is City => c !== null);
  }

  return {
    _id: branch._id,
    branchName: branch["Branch Name"] || branch.branchName || "Unknown Branch",
    slug: branch.Slug || branch.slug || "",
    address: branch.Address || branch.address || "",
    phone: branch.Phone || branch.phone || "",
    email: branch.Email || branch.email || "",
    branchImageUrl:
      branch["Branch Image (Image URL)"] ||
      branch["Branch Image"] ||
      branch.branchImageUrl ||
      "",
    primaryLocation: primaryLocationsData, // Include mapped cities
  };
}

// ----------------------------------------------------------------------
// Helper to map hospital data
// ----------------------------------------------------------------------
function mapHospitalData(hospital: any): Hospital | null {
  if (!hospital) return null;

  // Branches should be loaded via the .include("branches") in the query
  const rawBranches = hospital.branches || [];
  const mappedBranches = rawBranches
    .map(mapBranchData)
    .filter((b): b is Branch => b !== null);

  return {
    _id: hospital._id,
    name: hospital.Name || hospital.name || "Unknown Hospital",
    slug: hospital.Slug || hospital.slug || "",
    logo: hospital["Logo (Image URL)"] || hospital.logo || "",
    description: hospital.Description || hospital.description || "",
    branches: mappedBranches,
    branchCount: mappedBranches.length,
  };
}

// ----------------------------------------------------------------------
// GET handler for fetching hospitals and their branches with city
// ----------------------------------------------------------------------
export async function GET(request: NextRequest) {
  console.log(`[api/hospitals] GET request received`);

  try {
    const { searchParams } = new URL(request.url);
    const skip = Number(searchParams.get("skip") || 0);
    const limit = Math.min(
      Number(searchParams.get("limit") || DEFAULT_LIMIT),
      100
    );
    const search = searchParams.get("search") || "";
    const hospitalId = searchParams.get("hospitalId") || "";

    console.log(`[api/hospitals] Query params:`, {
      skip,
      limit,
      search,
      hospitalId,
    });

    // Updated the query to include the branch's city location
    // Note: The fields in .include() are references *on* the item.
    // "branches" is a reference on HOSPITALS.
    // "branches.primaryLocation" is a reference on BRANCHES.
    let query = wixServerClient.items
      .query(COLLECTION_IDS.HOSPITALS)
      .include("branches", "branches.primaryLocation") // Correctly includes the city data
      .skip(skip)
      .limit(limit);

    if (search) {
      query = query.contains("Name", search);
    }
    if (hospitalId) {
      query = query.eq("_id", hospitalId);
    }

    const response = await query.find({ consistentRead: true });

    if (!response?.items || response.items.length === 0) {
      return Response.json(
        { data: [], totalCount: 0, hasMore: false, success: true },
        { status: 200 }
      );
    }

    const mappedHospitals = response.items
      .map(mapHospitalData)
      .filter((h): h is Hospital => h !== null);

    const hasMore = (response.totalCount || 0) > skip + response.items.length;

    return Response.json(
      {
        data: mappedHospitals,
        totalCount: response.totalCount || 0,
        hasMore,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[api/hospitals] GET Error:", error);
    return Response.json(
      {
        error: "Failed to fetch hospitals",
        message: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// OPTIONS handler for CORS preflight requests
// ----------------------------------------------------------------------
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
// app/api/hospitals/utils.ts
// Utility functions for hospitals API

/**
 * Simple in-memory cache with TTL for performance optimization
 */
export class MemoryCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();

  set(key: string, data: T, ttlMs: number = 5 * 60 * 1000) {
    this.cache.set(key, { data, expiry: Date.now() + ttlMs });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  clear() {
    this.cache.clear();
  }
}

// Global caches for API data to reduce database queries
export const doctorsCache = new MemoryCache<Record<string, any>>();
export const citiesCache = new MemoryCache<Record<string, any>>();
export const treatmentsCache = new MemoryCache<Record<string, any>>();
export const specialistsCache = new MemoryCache<Record<string, any>>();
export const accreditationsCache = new MemoryCache<Record<string, any>>();

/**
 * Generates a URL-friendly slug from a name string.
 * @param name - The name to convert to a slug
 * @returns The generated slug
 */
export const generateSlug = (name: string): string => {
  if (!name || typeof name !== 'string') return ''
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Normalizes Delhi NCR city data.
 * @param cityData - The city data to normalize
 * @returns Normalized city data
 */
export const normalizeDelhiNCR = (cityData: any) => {
  const cityName = (cityData.cityName || "").toLowerCase().trim();
  const stateName = (cityData.state || "").toLowerCase().trim();

  const isDelhiNCRCity =
    cityName.includes("delhi") ||
    cityName.includes("gurugram") ||
    cityName.includes("gurgaon") ||
    cityName.includes("noida") ||
    cityName.includes("faridabad") ||
    cityName.includes("ghaziabad");

  const isDelhiNCRState =
    stateName.includes("delhi") ||
    stateName.includes("ncr") ||
    stateName === "delhi ncr";

  const isDelhiNCRRegion =
    (stateName === "haryana" || stateName.includes("haryana")) &&
    (cityName.includes("gurugram") || cityName.includes("gurgaon") || cityName.includes("faridabad")) ||
    (stateName === "uttar pradesh" || stateName.includes("uttar pradesh") || stateName.includes("up")) &&
    (cityName.includes("noida") || cityName.includes("ghaziabad") || cityName.includes("greater noida"));

  if (isDelhiNCRCity || isDelhiNCRState || isDelhiNCRRegion) {
    return {
      ...cityData,
      cityName: cityData.cityName || "Unknown City",
      state: "Delhi NCR",
      country: "India",
    };
  }

  return {
    ...cityData,
    cityName: cityData.cityName || "Unknown City",
    state: cityData.state || "Unknown State",
    country: cityData.country || (cityData.state && cityData.state !== "Unknown State" ? "India" : "Unknown Country"),
  };
};

/**
 * Extracts plain text from rich text content.
 * @param richContent - The rich text content
 * @returns Plain text string
 */
export const extractRichText = (richContent: any): string => {
  if (!richContent) return ""
  if (typeof richContent === "string") return richContent.trim()

  if (richContent.data && richContent.data.aboutDoctor !== undefined) {
    richContent = richContent.data
  }

  try {
    if (richContent.nodes && Array.isArray(richContent.nodes)) {
      return richContent.nodes
        .map((node: any) => {
          if (node.nodes && Array.isArray(node.nodes)) {
            return node.nodes.map((child: any) => child.textData?.text || child.text || "").join("")
          }
          return node.textData?.text || node.text || ""
        })
        .filter(Boolean)
        .join("\n")
        .trim()
    }
  } catch (e) {
    console.warn("Rich text parse failed:", e)
  }

  return String(richContent).trim() || ""
}

/**
 * Extracts HTML from rich text content.
 * @param richContent - The rich text content
 * @returns HTML string
 */
export const extractRichTextHTML = (richContent: any): string => {
  if (!richContent) return ""
  if (typeof richContent === "string") return richContent

  if (richContent.data) richContent = richContent.data

  let html = ""
  try {
    if (richContent.nodes && Array.isArray(richContent.nodes)) {
      richContent.nodes.forEach((node: any) => {
        const text =
          node.nodes?.map((n: any) => n.textData?.text || n.text || "").join("") ||
          node.textData?.text ||
          node.text ||
          ""

        switch (node.type) {
          case "PARAGRAPH":
            html += `<p>${text}</p>`
            break
          case "HEADING_ONE":
            html += `<h1>${text}</h1>`
            break
          case "HEADING_TWO":
            html += `<h2>${text}</h2>`
            break
          case "HEADING_THREE":
            html += `<h3>${text}</h3>`
            break
          case "BULLETED_LIST":
            html += "<ul>"
            node.nodes?.forEach((li: any) => {
              const liText = li.nodes?.map((n: any) => n.textData?.text || n.text || "").join("") || ""
              html += `<li>${liText}</li>`
            })
            html += "</ul>"
            break
          case "ORDERED_LIST":
            html += "<ol>"
            node.nodes?.forEach((li: any) => {
              const liText = li.nodes?.map((n: any) => n.textData?.text || n.text || "").join("") || ""
              html += `<li>${liText}</li>`
            })
            html += "</ol>"
            break
          default:
            if (text) html += `<p>${text}</p>`
        }
      })
      return html || extractRichText(richContent)
    }
  } catch (e) {
    console.warn("HTML parse failed:", e)
  }

  return extractRichText(richContent)
}

/**
 * Gets a value from an item using multiple possible keys.
 * @param item - The item to extract from
 * @param keys - Possible keys to check
 * @returns The found value or undefined
 */
export const getValue = (item: any, ...keys: string[]): string | undefined => {
  for (const key of keys) {
    const val = item?.[key] ?? item?.data?.[key]
    if (val !== undefined && val !== null && val !== "") {
      return String(val).trim()
    }
  }
  return undefined
}

/**
 * Checks if ShowHospital is true for a branch.
 * @param branch - The branch item
 * @returns True if the branch should show as a hospital
 */
export const shouldShowHospital = (branch: any): boolean => {
  // Check the ShowHospital boolean field from CMS
  const showHospital = branch?.ShowHospital ?? branch?.data?.ShowHospital ?? branch?.showHospital ?? branch?.data?.showHospital;
  // Handle different possible formats: boolean, string, number, etc.
  if (showHospital === true || showHospital === "true" || showHospital === 1 || showHospital === "1" || showHospital === "yes") {
    console.log(`Branch ${branch?._id} has showHospital=true, showing`);
    return true;
  }
  if (showHospital === false || showHospital === "false" || showHospital === 0 || showHospital === "0" || showHospital === "no") {
    console.log(`Branch ${branch?._id} has showHospital=false, hiding`);
    return false;
  }
  // If the field is not set or undefined/null, default to false
  if (showHospital === null || showHospital === undefined) {
    console.log(`Branch ${branch?._id} has showHospital undefined/null, defaulting to false, hiding`);
    return false;
  }
  // For any other unexpected value, log and default to false
  console.warn("Unexpected ShowHospital value:", showHospital, "for branch:", branch?._id, "defaulting to false");
  return false;
};

/**
 * Checks if ShowHospital is true for a hospital.
 * @param hospital - The hospital item
 * @returns True if the hospital should show
 */
export const shouldShowHospitalForHospital = (hospital: any): boolean => {
  // Check the ShowHospital boolean field from CMS on hospital record
  const showHospital = hospital?.ShowHospital ?? hospital?.data?.ShowHospital ?? hospital?.showHospital ?? hospital?.data?.showHospital;
  // Handle different possible formats: boolean, string, number, etc.
  if (showHospital === true || showHospital === "true" || showHospital === 1 || showHospital === "1" || showHospital === "yes") return true;
  if (showHospital === false || showHospital === "false" || showHospital === 0 || showHospital === "0" || showHospital === "no") {
    console.log(`Hospital ${hospital?._id} has showHospital=false, hiding`);
    return false;
  }
  // If the field is not set or undefined/null, default to true for backward compatibility
  if (showHospital === null || showHospital === undefined) return true;
  // For any other unexpected value, log and default to true
  console.warn("Unexpected ShowHospital value:", showHospital, "for hospital:", hospital?._id);
  return true;
};

/**
 * Checks if a branch is standalone (not part of a hospital group).
 * @param branch - The branch item
 * @returns True if the branch is standalone
 */
export const isStandaloneBranch = (branch: any): boolean => {
  // Check if branch has NO hospital group reference
  const hospitalGroupRefs = [
    branch.HospitalMaster_branches,
    branch.data?.HospitalMaster_branches,
    branch.hospitalGroup,
    branch.data?.hospitalGroup,
    branch["Hospital Group Master"],
    branch.data?.["Hospital Group Master"]
  ];

  // Check if ANY hospital group reference exists
  const hasHospitalGroupRef = hospitalGroupRefs.some(ref => {
    if (!ref) return false;
    if (typeof ref === 'string' && ref.trim() !== '') return true;
    if (Array.isArray(ref) && ref.length > 0) return true;
    if (typeof ref === 'object' && Object.keys(ref).length > 0) return true;
    return false;
  });

  // Check if branch has direct hospital reference
  const directHospitalRef = branch.hospital || branch.data?.hospital;
  const hasDirectHospitalRef =
    (typeof directHospitalRef === 'string' && directHospitalRef.trim() !== '') ||
    (Array.isArray(directHospitalRef) && directHospitalRef.length > 0) ||
    (typeof directHospitalRef === 'object' && directHospitalRef !== null);

  // If there's no hospital group reference AND no direct hospital reference,
  // then this is a standalone branch that should be treated as individual hospital
  return !hasHospitalGroupRef && !hasDirectHospitalRef;
};
// app/api/hospitals/route.ts - UPDATED: Doctor Specialization Mapping Fix
import { NextResponse } from "next/server";
import { wixClient } from "@/lib/wixClient";

const COLLECTIONS = {
  BRANCHES: "BranchesMaster",
  DOCTORS: "DoctorMaster",
  CITIES: "CityMaster",
  HOSPITALS: "HospitalMaster",
  ACCREDITATIONS: "Accreditation",
  SPECIALTIES: "SpecialistsMaster",
  DEPARTMENTS: "DepartmentsMaster",
  TREATMENTS: "TreatmentMaster",
};

// RICH TEXT EXTRACTOR - BULLETPROOF
function extractRichText(richContent: any): string {
  if (!richContent) return "";
  if (typeof richContent === "string") return richContent.trim();

  if (richContent.data && richContent.data.aboutDoctor !== undefined) {
    richContent = richContent.data;
  }

  try {
    if (richContent.nodes && Array.isArray(richContent.nodes)) {
      return richContent.nodes
        .map((node: any) => {
          if (node.nodes && Array.isArray(node.nodes)) {
            return node.nodes
              .map((child: any) => child.textData?.text || child.text || "")
              .join("");
          }
          return node.textData?.text || node.text || "";
        })
        .filter(Boolean)
        .join("\n")
        .trim();
    }
  } catch (e) {
    console.warn("Rich text parse failed:", e);
  }

  return String(richContent).trim() || "";
}

function extractRichTextHTML(richContent: any): string {
  if (!richContent) return "";
  if (typeof richContent === "string") return richContent;

  if (richContent.data) richContent = richContent.data;

  let html = "";
  try {
    if (richContent.nodes && Array.isArray(richContent.nodes)) {
      richContent.nodes.forEach((node: any) => {
        const text = node.nodes?.map((n: any) => n.textData?.text || n.text || "").join("") || node.textData?.text || node.text || "";

        switch (node.type) {
          case "PARAGRAPH":
            html += `<p>${text}</p>`;
            break;
          case "HEADING_ONE":
            html += `<h1>${text}</h1>`;
            break;
          case "HEADING_TWO":
            html += `<h2>${text}</h2>`;
            break;
          case "HEADING_THREE":
            html += `<h3>${text}</h3>`;
            break;
          case "BULLETED_LIST":
            html += "<ul>";
            node.nodes?.forEach((li: any) => {
              const liText = li.nodes?.map((n: any) => n.textData?.text || n.text || "").join("") || "";
              html += `<li>${liText}</li>`;
            });
            html += "</ul>";
            break;
          case "ORDERED_LIST":
            html += "<ol>";
            node.nodes?.forEach((li: any) => {
              const liText = li.nodes?.map((n: any) => n.textData?.text || n.text || "").join("") || "";
              html += `<li>${liText}</li>`;
            });
            html += "</ol>";
            break;
          default:
            if (text) html += `<p>${text}</p>`;
        }
      });
      return html || extractRichText(richContent);
    }
  } catch (e) {
    console.warn("HTML parse failed:", e);
  }

  return extractRichText(richContent);
}

function getValue(item: any, ...keys: string[]): string | null {
  for (const key of keys) {
    const val = item?.[key] ?? item?.data?.[key];
    if (val !== undefined && val !== null && val !== "") {
      return String(val).trim();
    }
  }
  return null;
}

// DATA MAPPERS - ENHANCED WITH DOCTOR SPECIALIZATION FIX
const DataMappers = {
  hospital: (item: any) => ({
    _id: item._id || item.ID,
    hospitalName: getValue(item, "hospitalName", "Hospital Name") || "Hospital",
    description: extractRichText(item.description || item.data?.description || item.Description),
    specialty: ReferenceMapper.multiReference(item.specialty, "specialtyName", "specialty", "title", "name"),
    yearEstablished: getValue(item, "yearEstablished", "Year Established"),
    hospitalImage: item.hospitalImage || item.data?.hospitalImage || item["hospitalImage"],
    logo: item.logo || item.data?.logo || item.Logo,
  }),

  branch: (item: any) => ({
    _id: item._id || item.ID,
    branchName: getValue(item, "branchName", "Branch Name") || "Branch",
    address: getValue(item, "address", "Address"),
    city: ReferenceMapper.multiReference(item.city, "cityName", "city name", "name"),
    specialty: ReferenceMapper.multiReference(item.specialty, "specialtyName", "specialty", "title", "name"),
    accreditation: ReferenceMapper.multiReference(item.accreditation, "title", "Title"),
    description: extractRichText(item.description || item.data?.description || item.Description),
    totalBeds: getValue(item, "totalBeds", "Total Beds"),
    noOfDoctors: getValue(item, "noOfDoctors", "No of Doctors"),
    yearEstablished: getValue(item, "yearEstablished"),
    branchImage: item.branchImage || item.data?.branchImage || item["Branch Image"],
    doctors: ReferenceMapper.multiReference(item.doctor, "doctorName", "Doctor Name"),
    
    // ENHANCED: Combined specialties + treatments
    specialization: [
      ...ReferenceMapper.multiReference(item.specialty, "specialtyName", "specialty", "title", "name"),
      ...ReferenceMapper.multiReference(
        item.treatment || item["treatment"],
        "treatmentName",
        "Treatment Name",
        "title",
        "name"
      ).map(t => ({
        ...t,
        name: t.name + " (Treatment)",
        isTreatment: true
      }))
    ],
    popular: getValue(item, "popular") === "true",
  }),

  // UPDATED: Doctor mapper with proper specialization mapping
  doctor: (item: any) => {
    const aboutField = item.aboutDoctor || item["aboutDoctor"] || item.data?.aboutDoctor || item.data?.["aboutDoctor"];
    
    // Handle specialization field properly - it should reference SpecialistsMaster
    const specialization = ReferenceMapper.multiReference(
      item.specialization || item["specialization"], 
      "specialtyName", "specialty", "title", "name"
    );
    
    return {
      _id: item._id || item.ID,
      doctorName: getValue(item, "doctorName", "Doctor Name") || "Doctor",
      specialization: specialization, // Now properly mapped to SpecialistsMaster
      department_doctor: ReferenceMapper.multiReference(item["Department_doctor"], "department", "Name"),
      qualification: getValue(item, "qualification", "Qualification"),
      experienceYears: getValue(item, "experienceYears", "Experience (Years)"),
      designation: getValue(item, "designation", "Designation"),
      aboutDoctor: extractRichText(aboutField),
      aboutDoctorHtml: extractRichTextHTML(aboutField),
      profileImage: item["profileImage"] || item["profile Image"] || item.profileImage || item.data?.profileImage,
      popular: getValue(item, "popular") === "true",
    };
  },

  city: (item: any) => ({
    _id: item._id,
    cityName: getValue(item, "cityName", "city name", "name"),
  }),

  accreditation: (item: any) => ({
    _id: item._id,
    title: getValue(item, "title", "Title"),
    image: item.image || item.data?.image || item.Image,
  }),

  specialty: (item: any) => ({
    _id: item._id,
    specialtyName: getValue(item, "specialtyName", "specialty", "title", "name"),
  }),

  // Specialist Mapper (from SpecialistsMaster)
  specialist: (item: any) => ({
    _id: item._id || item.ID,
    name: getValue(item, "specialtyName", "specialty", "title", "name") || "Specialist",
    treatments: ReferenceMapper.multiReference(
      item.treatment || item["treatment"] || item["SpecialistsMaster_treatment"],
      "treatmentName",
      "Treatment Name",
      "title",
      "name"
    ),
  }),

  treatment: (item: any) => ({
    _id: item._id,
    name: getValue(item, "treatmentName", "treatment", "title", "name"),
    description: extractRichText(item.Description || item.description),
    startingCost: getValue(item, "startingCost", "Starting Cost"),
    image: item["treatment image"] || item.treatmentImage || item.data?.["treatment image"],
    popular: getValue(item, "popular") === "true",
    // Reverse reference: which specialists offer this treatment
    offeredBySpecialists: ReferenceMapper.multiReference(
      item["SpecialistsMaster_treatment"],
      "specialtyName",
      "specialty"
    ),
  }),
};

// REFERENCE MAPPER
const ReferenceMapper = {
  multiReference: (field: any, ...nameKeys: string[]): any[] => {
    if (!field) return [];
    if (!Array.isArray(field)) field = [field].filter(Boolean);

    return field
      .map((ref: any) => {
        if (typeof ref === "string") return { _id: ref };
        const name = getValue(ref, ...nameKeys);
        const id = ref._id || ref.ID || ref.data?._id;
        return name && id ? { _id: id, name } : null;
      })
      .filter(Boolean);
  },

  extractIds: (refs: any[]): string[] =>
    refs
      .map((r) => (typeof r === "string" ? r : r?._id || r?.ID || r?.data?._id))
      .filter(Boolean) as string[],

  extractHospitalIds: (branch: any): string[] => {
    const set = new Set<string>();
    const keys = ["hospital", "HospitalMaster_branches", "hospitalGroup", "Hospital Group Master"];
    keys.forEach((k) => {
      const val = branch[k] || branch.data?.[k];
      if (!val) return;
      if (typeof val === "string") set.add(val);
      else if (Array.isArray(val)) {
        val.forEach((i: any) => {
          const id = typeof i === "string" ? i : i?._id || i?.ID || i?.data?._id;
          id && set.add(id);
        });
      } else if (val?._id || val?.ID || val?.data?._id) {
        set.add(val._id || val.ID || val.data._id);
      }
    });
    return Array.from(set);
  },
};

// DATA FETCHER
const DataFetcher = {
  async searchIds(collection: string, fields: string[], query: string): Promise<string[]> {
    const ids = new Set<string>();
    for (const field of fields) {
      try {
        const res = await wixClient.items
          .query(collection)
          .contains(field as any, query)
          .limit(500)
          .find();
        res.items.forEach((i: any) => i._id && ids.add(i._id));
      } catch (e) {
        console.warn(`Search failed on ${collection}.${field}:`, e);
      }
    }
    return Array.from(ids);
  },

  async fetchByIds(collection: string, ids: string[], mapper: (i: any) => any) {
    if (!ids.length) return {};
    const res = await wixClient.items.query(collection).hasSome("_id", ids).find();
    return res.items.reduce((acc, item) => {
      acc[item._id!] = mapper(item);
      return acc;
    }, {} as Record<string, any>);
  },

  // UPDATED: Fetch doctors with proper specialization references
  async fetchDoctors(ids: string[]) {
    if (!ids.length) return {};
    const res = await wixClient.items
      .query(COLLECTIONS.DOCTORS)
      .hasSome("_id", ids)
      .include("specialization", "Department_doctor")
      .find();

    // Extract specialization IDs from doctors
    const specializationIds = new Set<string>();
    res.items.forEach(d => {
      const specializations = d.specialization || d.data?.specialization || [];
      (Array.isArray(specializations) ? specializations : [specializations]).forEach((s: any) => {
        const id = s?._id || s?.ID || s;
        id && specializationIds.add(id);
      });
    });

    // Fetch the actual specialization data
    const specializations = await DataFetcher.fetchByIds(
      COLLECTIONS.SPECIALTIES, 
      Array.from(specializationIds), 
      DataMappers.specialist
    );

    return res.items.reduce((acc, d) => {
      const doctor = DataMappers.doctor(d);
      
      // Enrich specialization with actual specialist data
      doctor.specialization = doctor.specialization.map((spec: any) => 
        specializations[spec._id] || spec
      );

      acc[d._id!] = doctor;
      return acc;
    }, {} as Record<string, any>);
  },

  // Fetch Specialists with Treatments
  async fetchSpecialistsWithTreatments(specialistIds: string[]) {
    if (!specialistIds.length) return {};
    const res = await wixClient.items
      .query(COLLECTIONS.SPECIALTIES)
      .hasSome("_id", specialistIds)
      .include("treatment")
      .find();

    const treatmentIds = new Set<string>();
    res.items.forEach(s => {
      const treatments = s.treatment || s.data?.treatment || [];
      (Array.isArray(treatments) ? treatments : [treatments]).forEach((t: any) => {
        const id = t?._id || t?.ID || t;
        id && treatmentIds.add(id);
      });
    });

    const treatments = await DataFetcher.fetchByIds(COLLECTIONS.TREATMENTS, Array.from(treatmentIds), DataMappers.treatment);

    return res.items.reduce((acc, item) => {
      const spec = DataMappers.specialist(item);
      acc[item._id!] = {
        ...spec,
        treatments: spec.treatments.map(t => treatments[t._id] || t),
      };
      return acc;
    }, {} as Record<string, any>);
  },
};

// QUERY BUILDER
const QueryBuilder = {
  async getHospitalIds(filters: {
    branchIds?: string[];
    cityIds?: string[];
    doctorIds?: string[];
    specialtyIds?: string[];
    accreditationIds?: string[];
    treatmentIds?: string[];
  }): Promise<string[]> {
    const { branchIds, cityIds, doctorIds, specialtyIds, accreditationIds, treatmentIds } = filters;
    if (!branchIds?.length && !cityIds?.length && !doctorIds?.length && !specialtyIds?.length && !accreditationIds?.length && !treatmentIds?.length)
      return [];

    const query = wixClient.items
      .query(COLLECTIONS.BRANCHES)
      .include("hospital", "HospitalMaster_branches", "city", "doctor", "specialty", "accreditation", "treatment");

    if (branchIds?.length) query.hasSome("_id", branchIds);
    if (cityIds?.length) query.hasSome("city", cityIds);
    if (doctorIds?.length) query.hasSome("doctor", doctorIds);
    if (specialtyIds?.length) query.hasSome("specialty", specialtyIds);
    if (accreditationIds?.length) query.hasSome("accreditation", accreditationIds);
    if (treatmentIds?.length) query.hasSome("treatment", treatmentIds);

    const result = await query.limit(1000).find();
    const hospitalIds = new Set<string>();
    result.items.forEach((b: any) =>
      ReferenceMapper.extractHospitalIds(b).forEach((id) => hospitalIds.add(id))
    );
    return Array.from(hospitalIds);
  },
};

// ENRICH DATA - INCLUDES DOCTOR SPECIALIZATION FIX
async function enrichHospitals(
  hospitals: any[],
  filterIds: { city: string[]; doctor: string[]; specialty: string[]; accreditation: string[]; branch: string[]; treatment: string[] }
) {
  const hospitalIds = hospitals.map((h) => h._id!).filter(Boolean);

  const branchesRes = await wixClient.items
    .query(COLLECTIONS.BRANCHES)
    .include("hospital", "HospitalMaster_branches", "city", "doctor", "specialty", "accreditation", "treatment")
    .hasSome("HospitalMaster_branches", hospitalIds)
    .limit(1000)
    .find();

  const branchesByHospital: Record<string, any[]> = {};
  const doctorIds = new Set<string>();
  const cityIds = new Set<string>();
  const specialtyIds = new Set<string>();
  const accreditationIds = new Set<string>();
  const treatmentIds = new Set<string>();

  branchesRes.items.forEach((b: any) => {
    const hIds = ReferenceMapper.extractHospitalIds(b);
    hIds.forEach((hid) => {
      if (hospitalIds.includes(hid)) {
        if (!branchesByHospital[hid]) branchesByHospital[hid] = [];
        const mapped = DataMappers.branch(b);
        branchesByHospital[hid].push(mapped);

        ReferenceMapper.extractIds(mapped.doctors).forEach((id) => doctorIds.add(id));
        ReferenceMapper.extractIds(mapped.city).forEach((id) => cityIds.add(id));
        ReferenceMapper.extractIds(mapped.accreditation).forEach((id) => accreditationIds.add(id));

        // Separate specialty IDs from treatment IDs
        mapped.specialization.forEach((s: any) => {
          if (s.isTreatment) {
            treatmentIds.add(s._id);
          } else {
            specialtyIds.add(s._id);
          }
        });
      }
    });
  });

  const [doctors, cities, specialties, accreditations, treatments, specialists] = await Promise.all([
    DataFetcher.fetchDoctors(Array.from(doctorIds)), // Now returns enriched doctors with proper specializations
    DataFetcher.fetchByIds(COLLECTIONS.CITIES, Array.from(cityIds), DataMappers.city),
    DataFetcher.fetchByIds(COLLECTIONS.SPECIALTIES, Array.from(specialtyIds), DataMappers.specialty),
    DataFetcher.fetchByIds(COLLECTIONS.ACCREDITATIONS, Array.from(accreditationIds), DataMappers.accreditation),
    DataFetcher.fetchByIds(COLLECTIONS.TREATMENTS, Array.from(treatmentIds), DataMappers.treatment),
    DataFetcher.fetchSpecialistsWithTreatments(Array.from(specialtyIds)),
  ]);

  const allSpecializations = { ...specialties, ...treatments, ...specialists };

  return hospitals.map((hospital) => {
    const rawBranches = branchesByHospital[hospital._id!] || [];
    const filteredBranches = rawBranches.filter((b) => {
      const matchBranch = !filterIds.branch.length || filterIds.branch.includes(b._id);
      const matchCity = !filterIds.city.length || b.city.some((c: any) => filterIds.city.includes(c._id));
      const matchDoctor = !filterIds.doctor.length || b.doctors.some((d: any) => filterIds.doctor.includes(d._id));
      const matchSpecialty = !filterIds.specialty.length || b.specialization.some((s: any) => !s.isTreatment && filterIds.specialty.includes(s._id));
      const matchTreatment = !filterIds.treatment.length || b.specialization.some((s: any) => s.isTreatment && filterIds.treatment.includes(s._id));
      const matchAccred = !filterIds.accreditation.length || b.accreditation.some((a: any) => filterIds.accreditation.includes(a._id));
      return matchBranch && matchCity && matchDoctor && matchSpecialty && matchTreatment && matchAccred;
    });

    const enrichedBranches = filteredBranches.map((b) => ({
      ...b,
      doctors: b.doctors.map((d: any) => doctors[d._id] || d), // Now includes enriched specializations
      city: b.city.map((c: any) => cities[c._id] || c),
      specialization: b.specialization.map((s: any) => allSpecializations[s._id] || s),
      accreditation: b.accreditation.map((a: any) => accreditations[a._id] || a),
    }));

    const uniqueDoctors = new Map();
    const uniqueSpecializations = new Map();
    const uniqueSpecialists = new Map();
    const uniqueTreatments = new Map();

    enrichedBranches.forEach((b) => {
      b.doctors.forEach((d: any) => d._id && uniqueDoctors.set(d._id, d));
      b.specialization.forEach((s: any) => {
        if (s.isTreatment) {
          uniqueTreatments.set(s._id, s);
        } else {
          uniqueSpecialists.set(s._id, specialists[s._id] || s);
        }
      });
    });

    const mapped = DataMappers.hospital(hospital);

    return {
      ...mapped,
      branches: enrichedBranches,
      doctors: Array.from(uniqueDoctors.values()),
      specialists: Array.from(uniqueSpecialists.values()),
      treatments: Array.from(uniqueTreatments.values()),
      specialization: Array.from(uniqueTreatments.values()),
      accreditations: enrichedBranches.flatMap(b => b.accreditation),
    };
  });
}

// GET /api/hospitals
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = {
      q: url.searchParams.get("q")?.trim() || "",
      page: Math.max(0, Number(url.searchParams.get("page") || 0)),
      pageSize: Math.min(50, Number(url.searchParams.get("pageSize") || 20)),
      hospitalId: url.searchParams.get("hospitalId")?.trim(),
      hospitalText: url.searchParams.get("hospital")?.trim(),
      branchText: url.searchParams.get("branch")?.trim(),
      cityText: url.searchParams.get("city")?.trim(),
      doctorText: url.searchParams.get("doctor")?.trim(),
      specialtyText: url.searchParams.get("specialty")?.trim(),
      accreditationText: url.searchParams.get("accreditation")?.trim(),
      treatmentText: url.searchParams.get("treatment")?.trim(),
      branchId: url.searchParams.get("branchId"),
      cityId: url.searchParams.get("cityId"),
      doctorId: url.searchParams.get("doctorId"),
      specialtyId: url.searchParams.get("specialtyId"),
      accreditationId: url.searchParams.get("accreditationId"),
      treatmentId: url.searchParams.get("treatmentId"),
    };

    const [
      hospitalIdsFromText,
      branchIdsFromText,
      cityIdsFromText,
      doctorIdsFromText,
      specialtyIdsFromText,
      accreditationIdsFromText,
      treatmentIdsFromText,
    ] = await Promise.all([
      params.hospitalText ? DataFetcher.searchIds(COLLECTIONS.HOSPITALS, ["hospitalName"], params.hospitalText) : Promise.resolve([]),
      params.branchText ? DataFetcher.searchIds(COLLECTIONS.BRANCHES, ["branchName"], params.branchText) : Promise.resolve([]),
      params.cityText ? DataFetcher.searchIds(COLLECTIONS.CITIES, ["cityName"], params.cityText) : Promise.resolve([]),
      params.doctorText ? DataFetcher.searchIds(COLLECTIONS.DOCTORS, ["doctorName"], params.doctorText) : Promise.resolve([]),
      params.specialtyText ? DataFetcher.searchIds(COLLECTIONS.SPECIALTIES, ["specialtyName"], params.specialtyText) : Promise.resolve([]),
      params.accreditationText ? DataFetcher.searchIds(COLLECTIONS.ACCREDITATIONS, ["title"], params.accreditationText) : Promise.resolve([]),
      params.treatmentText ? DataFetcher.searchIds(COLLECTIONS.TREATMENTS, ["treatmentName"], params.treatmentText) : Promise.resolve([]),
    ]);

    const filterIds = {
      branch: [...branchIdsFromText, ...(params.branchId ? [params.branchId] : [])],
      city: [...cityIdsFromText, ...(params.cityId ? [params.cityId] : [])],
      doctor: [...doctorIdsFromText, ...(params.doctorId ? [params.doctorId] : [])],
      specialty: [...specialtyIdsFromText, ...(params.specialtyId ? [params.specialtyId] : [])],
      accreditation: [...accreditationIdsFromText, ...(params.accreditationId ? [params.accreditationId] : [])],
      treatment: [...treatmentIdsFromText, ...(params.treatmentId ? [params.treatmentId] : [])],
    };

    let finalHospitalIds: string[] = [];

    if (Object.values(filterIds).some((arr) => arr.length > 0)) {
      finalHospitalIds = await QueryBuilder.getHospitalIds(filterIds);
      if (finalHospitalIds.length === 0) {
        return NextResponse.json({ items: [], total: 0 });
      }
    }

    let query = wixClient.items
      .query(COLLECTIONS.HOSPITALS)
      .include("specialty")
      .descending("_createdDate")
      .limit(params.pageSize)
      .skip(params.page * params.pageSize);

    if (params.hospitalId) {
      query = query.eq("_id", params.hospitalId);
    } else if (finalHospitalIds.length > 0) {
      query = query.hasSome("_id", finalHospitalIds);
    }

    if (params.q || hospitalIdsFromText.length > 0) {
      const qIds = params.q
        ? await DataFetcher.searchIds(COLLECTIONS.HOSPITALS, ["hospitalName"], params.q)
        : hospitalIdsFromText;
      if (qIds.length === 0) return NextResponse.json({ items: [], total: 0 });
      const intersection = finalHospitalIds.length > 0 ? finalHospitalIds.filter((id) => qIds.includes(id)) : qIds;
      if (intersection.length === 0) return NextResponse.json({ items: [], total: 0 });
      query = query.hasSome("_id", intersection);
    }

    const result = await query.find();
    const enriched = await enrichHospitals(result.items, filterIds);

    return NextResponse.json({
      items: enriched,
      total: result.totalCount || enriched.length,
      page: params.page,
      pageSize: params.pageSize,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch hospitals", details: error.message },
      { status: 500 }
    );
  }
}
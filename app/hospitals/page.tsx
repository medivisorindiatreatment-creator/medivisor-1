// File: app/hospitals/page.tsx

"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Banner from "@/components/BannerService"
import {
  Filter,
  Loader2,
  Hospital,
  Building2,
  Award,
  MapPin,
  Stethoscope,
  Home,
  X,
  DollarSign,
} from "lucide-react"

const getWixImageUrl = (imageStr: string): string | null => {
  if (!imageStr || typeof imageStr !== 'string') return null;
  if (!imageStr.startsWith('wix:image://v1/')) return null;

  const parts = imageStr.split('/');
  if (parts.length < 4) return null;

  const id = parts[3];
  return `https://static.wixstatic.com/media/${id}`;
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const isUUID = (str: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

interface AccreditationType {
  _id: string;
  name: string;
  description: string | null;
  image: string | null;
  issuingBody: string | null;
  year: string | null;
}

interface SpecialtyType {
  _id: string;
  name: string;
}

interface DoctorType {
  _id: string;
  name: string;
  specialization: SpecialtyType[] | string[] | string | null;
  qualification: string | null;
  experience: string | null;
  designation: string | null;
  languagesSpoken: string | null;
  about: string | null;
  profileImage: any | null;
  popular?: boolean;
  treatments?: any[];
}

interface ExtendedDoctorType extends DoctorType {
  hospitalName: string;
  branchName?: string;
  branchId?: string;
}

interface TreatmentType {
  _id: string;
  name: string;
  description: string | null;
  category: string | null;
  duration: string | null;
  cost: string | null;
  treatmentImage?: string | null;
  popular?: boolean;
}

interface ExtendedTreatmentType extends TreatmentType {
  hospitalName: string;
  branchName?: string;
  branchId?: string;
}

interface CityType {
  _id: string;
  name: string;
  state: string | null;
  country: string | null;
}

interface BranchType {
  _id: string;
  name: string;
  address: string | null;
  city: CityType[] | null;
  contactNumber: string | null;
  email: string | null;
  totalBeds: number | null;
  icuBeds: string | null;
  yearEstablished: number | null;
  emergencyContact: string | null;
  branchImage: any | null;
  description: string | null;
  doctors: DoctorType[];
  treatments: TreatmentType[];
  specialties: SpecialtyType[];
  accreditation: AccreditationType[];
  noOfDoctors: string | null;
  popular?: boolean;
}

interface HospitalType {
  _id: string;
  name: string;
  slug: string | null;
  image: string | null;
  logo: string | null;
  yearEstablished: string | null;
  accreditation: AccreditationType[] | null;
  beds: string | null;
  emergencyServices: boolean | null;
  description: string | null;
  website: string | null;
  email: string | null;
  contactNumber: string | null;
  branches: BranchType[];
  doctors: DoctorType[];
  treatments: TreatmentType[];
}

// Sub-component: Breadcrumb Navigation
const BreadcrumbNav = () => (
  <nav aria-label="Breadcrumb" className="container border-t border-gray-100 bg-white mx-auto px-4 sm:px-6 lg:px-8">
    <ol className="flex items-center px-2 md:px-0 space-x-1 py-3 text-sm text-gray-600">
      <li>
        <Link href="/" className="flex items-center hover:text-gray-800 transition-colors">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
      </li>
      <li>
        <span className="mx-1">/</span>
      </li>
      <li className="text-gray-900 font-medium">Hospitals</li>
    </ol>
  </nav>
);

// Sub-component: Skeleton Components
const HospitalCardSkeleton = () => (
  <div className="bg-white rounded-sm shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <div className="absolute top-3 right-3 bg-gray-100 rounded w-20 h-6" />
    </div>
    <div className="p-4 space-y-4">
      <div className="h-6 bg-gray-50 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-50 rounded w-1/4" />
        <div className="h-4 bg-gray-50 rounded w-3/4" />
      </div>
      <div className="grid grid-cols-2 gap-2 pt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded p-3 h-16" />
        ))}
      </div>
    </div>
  </div>
);

const DoctorCardSkeleton = () => (
  <div className="bg-white rounded-sm shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative" />
    <div className="p-4 space-y-4">
      <div className="h-6 bg-gray-50 rounded w-3/4" />
      <div className="h-4 bg-gray-50 rounded w-1/2" />
      <div className="h-3 bg-gray-50 rounded w-full" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-50 rounded w-3/4" />
        <div className="h-3 bg-gray-50 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const TreatmentCardSkeleton = () => (
  <div className="bg-white rounded-sm shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative" />
    <div className="p-4 space-y-4">
      <div className="h-6 bg-gray-50 rounded w-3/4" />
      <div className="h-4 bg-gray-50 rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-50 rounded w-3/4" />
        <div className="h-3 bg-gray-50 rounded w-1/2" />
      </div>
    </div>
  </div>
);

// Sub-component: View Toggle
interface ViewToggleProps {
  view: 'hospitals' | 'doctors' | 'treatments';
  setView: (view: 'hospitals' | 'doctors' | 'treatments') => void;
}

const ViewToggle = ({ view, setView }: ViewToggleProps) => (
  <div className="flex bg-white rounded-sm shadow-sm p-1 mb-6 mx-auto lg:mx-0 max-w-md">
    <button
      onClick={() => setView('hospitals')}
      className={`flex-1 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
        view === 'hospitals'
          ? 'bg-gray-50 text-gray-900'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      Hospitals
    </button>
    <button
      onClick={() => setView('doctors')}
      className={`flex-1 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
        view === 'doctors'
          ? 'bg-gray-50 text-gray-900'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      Doctors
    </button>
    <button
      onClick={() => setView('treatments')}
      className={`flex-1 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
        view === 'treatments'
          ? 'bg-gray-50 text-gray-900'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      Treatments
    </button>
  </div>
);

// Sub-component: Sorting
interface SortingProps {
  sortBy: 'all' | 'popular' | 'az' | 'za';
  setSortBy: (sortBy: 'all' | 'popular' | 'az' | 'za') => void;
}

const Sorting = ({ sortBy, setSortBy }: SortingProps) => (
  <div className="flex items-center gap-2">
    <label className="text-sm text-gray-600 hidden sm:block">Sort by:</label>
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value as 'all' | 'popular' | 'az' | 'za')}
      className="border border-transparent w-40 rounded-sm px-3 py-2 text-sm focus:ring-1 focus:ring-gray-200 focus:border-gray-200 bg-white shadow-sm"
    >
      <option value="all">All</option>
      <option value="popular">Popular</option>
      <option value="az">A to Z</option>
      <option value="za">Z to A</option>
    </select>
  </div>
);

// Sub-component: Results Header
interface ResultsHeaderProps {
  view: 'hospitals' | 'doctors' | 'treatments';
  currentCount: number;
  clearFilters: () => void;
  sortBy: 'all' | 'popular' | 'az' | 'za';
  setSortBy: (sortBy: 'all' | 'popular' | 'az' | 'za') => void;
}

const ResultsHeader = ({ view, currentCount, clearFilters, sortBy, setSortBy }: ResultsHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="text-sm text-gray-600">
      {currentCount} {view}s found
    </div>
    <div className="flex items-center gap-4">
      <Sorting sortBy={sortBy} setSortBy={setSortBy} />
      <button
        onClick={clearFilters}
        className="hidden md:inline-flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

// Sub-component: Mobile Filter Button
interface MobileFilterButtonProps {
  setShowFilters: (show: boolean) => void;
}

const MobileFilterButton = ({ setShowFilters }: MobileFilterButtonProps) => (
  <button
    onClick={() => setShowFilters(true)}
    className="fixed bottom-6 right-6 md:hidden bg-gray-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-30"
  >
    <Filter className="w-5 h-5" />
  </button>
);

// Sub-component: Hospital Card
interface HospitalCardProps {
  branch: BranchType;
  hospitalName: string;
  hospitalLogo: string | null;
  treatmentName?: string | null;
}

const HospitalCard = ({ branch, hospitalName, hospitalLogo, treatmentName }: HospitalCardProps) => {
  const slug = generateSlug(`${hospitalName} ${branch.name}`);

  const imageUrl = getWixImageUrl(branch.branchImage?.imageData?.image?.src?.id || branch.branchImage) || null;

  const cities = branch.city?.map(c => c.name).filter(Boolean) || [];
  const primaryCity = cities[0] || "";
  const primaryState = branch.city?.[0]?.state || "";

  const displayAccreditations = branch.accreditation?.slice(0, 3) || [];
  const remainingAccreditations = branch.accreditation?.length - 3 || 0;

  const hospitalLogoUrl = hospitalLogo ? getWixImageUrl(hospitalLogo) : null;

  const primarySpecialty = branch.specialties?.[0]?.name || 'General Care';

  return (
    <Link href={`/hospitals/branches/${slug}`} className="block">
      <article className="group bg-white rounded-sm shadow-sm transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        <div className="relative h-60 md:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          <div className="absolute top-2 right-2 z-10 flex justify-end flex-wrap gap-1">
            {displayAccreditations.map((acc) => (
              <span
                key={acc._id}
                className="inline-flex items-center gap-1 text-xs bg-white/90 text-gray-700 px-2 py-1 rounded shadow-sm backdrop-blur"
              >
                {acc.image ? (
                  <img
                    src={getWixImageUrl(acc.image)}
                    alt={acc.name}
                    className="w-4 h-4 rounded object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Award className="w-3 h-3" />
                )}
              </span>
            ))}
            {remainingAccreditations > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-white/90 text-gray-600 px-2 py-1 rounded shadow-sm backdrop-blur">
                +{remainingAccreditations}
              </span>
            )}
          </div>

          {hospitalLogoUrl && (
            <div className="absolute bottom-3 left-3 z-10">
              <img
                src={hospitalLogoUrl}
                alt={`${hospitalName} logo`}
                className="w-12 h-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={branch.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Hospital className="w-12 h-12 text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <header className="mb-2">
            <h2 className="text-xl font-medium leading-tight line-clamp-2 group-hover:text-gray-900 transition-colors text-gray-900">
              {branch.name}
            </h2>

            {primaryCity && (
              <div className="pt-1 flex gap-1">
                <div className="flex items-center gap-x-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{primaryCity}, {primaryState}</span>
                </div>
                <p className="text-sm text-gray-700">{primarySpecialty} Specialty</p>
              </div>
            )}

            {treatmentName && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 flex-shrink-0" />
                  Available: <span className="text-gray-900">{treatmentName}</span>
                </p>
              </div>
            )}
          </header>

          <footer className="border-t border-gray-100 pt-3 mt-auto">
            <div className="grid grid-cols-3 gap-3">
              {branch.noOfDoctors && (
                <div className="text-center rounded bg-gray-50 p-2">
                  <p className="text-lg font-medium text-gray-900">{branch.noOfDoctors}+</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Doctors</p>
                </div>
              )}
              {branch.totalBeds && (
                <div className="text-center rounded bg-gray-50 p-2">
                  <p className="text-lg font-medium text-gray-900">{branch.totalBeds}+</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Beds</p>
                </div>
              )}
              {branch.yearEstablished && (
                <div className="text-center rounded bg-gray-50 p-2">
                  <p className="text-lg font-medium text-gray-900">{branch.yearEstablished}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Estd</p>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </Link>
  );
};

// Sub-component: Doctor Card
interface DoctorCardProps {
  doctor: ExtendedDoctorType;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const slug = generateSlug(doctor.name);
  const imageUrl = getWixImageUrl(doctor.profileImage) || null;

  const specializationDisplay = useMemo(() => {
    if (!doctor.specialization) return "General Practitioner";
    if (Array.isArray(doctor.specialization)) {
      let names: string[] = [];
      if (doctor.specialization.length > 0 && typeof doctor.specialization[0] === 'object' && 'name' in doctor.specialization[0]) {
        names = doctor.specialization.map((spec: any) => spec.name).filter(Boolean);
      } else {
        names = doctor.specialization.filter(Boolean) as string[];
      }
      return names.join(', ') || "General Practitioner";
    }
    return doctor.specialization as string;
  }, [doctor.specialization]);

  return (
    <Link href={`/doctors/${slug}`} className="block">
      <article className="group bg-white rounded-sm shadow-sm overflow-hidden cursor-pointer h-full flex flex-col">
        <div className="relative h-60 md:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={doctor.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope className="w-12 h-12 text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <header className="space-y-1.5">
            <h2 className="text-xl font-medium leading-tight line-clamp-2 group-hover:text-gray-900 transition-colors text-gray-900">
              {doctor.name}
            </h2>
            <p className="text-sm text-gray-600 font-normal">{specializationDisplay}</p>
            <p className="text-sm text-gray-700 leading-relaxed font-normal border-t border-gray-100 pt-2">
              {doctor.hospitalName}
              {doctor.branchName ? `, ${doctor.branchName}` : ""}
            </p>
            {doctor.experience && (
              <p className="text-sm text-gray-500 font-normal">{doctor.experience} years of experience</p>
            )}
          </header>
        </div>
      </article>
    </Link>
  );
};

// Sub-component: Treatment Card
interface TreatmentCardProps {
  treatment: ExtendedTreatmentType;
}

const TreatmentCard = ({ treatment }: TreatmentCardProps) => {
  const slug = generateSlug(treatment.name);
  const imageUrl = getWixImageUrl(treatment.treatmentImage) || null;

  return (
    <Link href={`/treatment/${slug}`} className="block">
      <article className="group bg-white rounded-sm shadow-sm transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        <div className="relative h-60 md:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={treatment.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope className="w-12 h-12 text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        </div>
        <div className="p-5 pb-0 flex-1 flex flex-col">
          <header className="space-y-1.5 mb-3">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">
                {treatment.name}
              </h2>
              {treatment.category && (
                <p className="text-sm text-gray-600 font-normal">{treatment.category}</p>
              )}
            </div>

            {treatment.cost && (
              <div className="pt-2 border-t border-gray-200">
                <p className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 text-sm font-medium">{treatment.cost}</span>
                </p>
              </div>
            )}
          </header>
        </div>
      </article>
    </Link>
  );
};

// Sub-component: Filter Dropdown
interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { id: string; name: string }[];
  selectedOption: string;
  onOptionSelect: (id: string) => void;
  onClear: () => void;
  type: "branch" | "city" | "treatment" | "doctor" | "specialty";
}

const FilterDropdown = ({
  value,
  onChange,
  placeholder,
  options,
  selectedOption,
  onOptionSelect,
  onClear,
  type,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      ),
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOptionName = options.find((opt) => opt.id === selectedOption)?.name;

  const getIcon = () => {
    switch (type) {
      case "branch":
        return <Building2 className="w-4 h-4 text-gray-400" />;
      case "city":
        return <MapPin className="w-4 h-4 text-gray-400" />;
      case "treatment":
      case "doctor":
      case "specialty":
        return <Stethoscope className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getNoResultsText = () => {
    switch (type) {
      case "branch":
        return "branches";
      case "city":
        return "cities";
      case "treatment":
        return "treatments";
      case "doctor":
        return "doctors";
      case "specialty":
        return "specializations";
      default:
        return "options";
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true);
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (selectedOption) onOptionSelect("");
    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className="relative space-y-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {getIcon()}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={selectedOptionName || value}
          onChange={handleChange}
          onFocus={handleFocus}
          className="pl-10 pr-12 py-3 border border-transparent rounded-sm w-full text-sm bg-white focus:bg-white focus:ring-1 focus:ring-gray-200 focus:border-gray-200 transition-all placeholder:text-gray-400 shadow-sm"
        />

        {(value || selectedOption) && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Clear filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-sm shadow-lg border border-gray-200 z-10 max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No {getNoResultsText()} found
              </div>
            ) : (
              <ul className="py-1">
                {filteredOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      onClick={() => {
                        onOptionSelect(option.id);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Stethoscope className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {option.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component: No Results
interface NoResultsProps {
  view: 'hospitals' | 'doctors' | 'treatments';
  onClear: () => void;
}

const NoResults = ({ view, onClear }: NoResultsProps) => {
  const getTitle = () => {
    switch (view) {
      case 'hospitals': return 'No Hospitals Found';
      case 'doctors': return 'No Doctors Found';
      case 'treatments': return 'No Treatments Found';
      default: return 'No Results Found';
    }
  };

  const getDescription = () => {
    switch (view) {
      case 'hospitals': return 'Try adjusting your filters or search criteria to find hospitals.';
      case 'doctors': return 'Try adjusting your filters or search criteria to find doctors.';
      case 'treatments': return 'Try adjusting your filters or search criteria to find treatments.';
      default: return 'Try adjusting your filters or search criteria.';
    }
  };

  return (
    <div className="text-center py-12">
      <Hospital className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{getTitle()}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{getDescription()}</p>
      <button onClick={onClear} className="bg-gray-900 text-white px-6 py-2 rounded-sm font-medium hover:bg-gray-800 transition-colors">
        Clear Filters
      </button>
    </div>
  );
};

// Sub-component: Filter Sidebar
interface FilterSidebarProps {
  view: 'hospitals' | 'doctors' | 'treatments';
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  clearFilters: () => void;
  branchQuery: string;
  setBranchQuery: (query: string) => void;
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  cityQuery: string;
  setCityQuery: (query: string) => void;
  selectedCityId: string;
  setSelectedCityId: (id: string) => void;
  treatmentQuery: string;
  setTreatmentQuery: (query: string) => void;
  selectedTreatmentId: string;
  setSelectedTreatmentId: (id: string) => void;
  doctorQuery: string;
  setDoctorQuery: (query: string) => void;
  selectedDoctorId: string;
  setSelectedDoctorId: (id: string) => void;
  specializationQuery: string;
  setSpecializationQuery: (query: string) => void;
  selectedSpecializationId: string;
  setSelectedSpecializationId: (id: string) => void;
  availableBranchOptions: { id: string; name: string }[];
  availableCityOptions: { id: string; name: string }[];
  availableTreatmentOptions: { id: string; name: string }[];
  availableDoctorOptions: { id: string; name: string }[];
  availableSpecializationOptions: { id: string; name: string }[];
}

const FilterSidebar = (props: FilterSidebarProps) => {
  const getAvailableCityOptions = () => props.availableCityOptions;
  const getAvailableTreatmentOptions = () => props.availableTreatmentOptions;

  return (
    <aside className={`lg:w-80 lg:flex-shrink-0 transition-all duration-300 ${props.showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:translate-x-0`}>
      <div className={`lg:sticky lg:top-8 h-fit bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden ${props.showFilters ? 'fixed inset-y-0 left-0 z-50 w-80 transform translate-x-0' : ''}`}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h2>
          {props.showFilters && (
            <button
              onClick={() => props.setShowFilters(false)}
              className="absolute right-4 top-4 lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="p-6 space-y-6">
          {props.view === 'doctors' && props.availableDoctorOptions.length > 0 && (
            <FilterDropdown
              value={props.doctorQuery}
              onChange={props.setDoctorQuery}
              placeholder="Search by doctor name"
              options={props.availableDoctorOptions}
              selectedOption={props.selectedDoctorId}
              onOptionSelect={props.setSelectedDoctorId}
              onClear={() => {
                props.setDoctorQuery("");
                props.setSelectedDoctorId("");
              }}
              type="doctor"
            />
          )}
          {props.view === 'doctors' && props.availableSpecializationOptions.length > 0 && (
            <FilterDropdown
              value={props.specializationQuery}
              onChange={props.setSpecializationQuery}
              placeholder="Search by specialization"
              options={props.availableSpecializationOptions}
              selectedOption={props.selectedSpecializationId}
              onOptionSelect={props.setSelectedSpecializationId}
              onClear={() => {
                props.setSpecializationQuery("");
                props.setSelectedSpecializationId("");
              }}
              type="specialty"
            />
          )}
          {props.view === 'hospitals' && props.availableBranchOptions.length > 0 && (
            <FilterDropdown
              value={props.branchQuery}
              onChange={props.setBranchQuery}
              placeholder="Search by hospital name"
              options={props.availableBranchOptions}
              selectedOption={props.selectedBranchId}
              onOptionSelect={props.setSelectedBranchId}
              onClear={() => {
                props.setBranchQuery("");
                props.setSelectedBranchId("");
              }}
              type="branch"
            />
          )}
          {(props.view === 'hospitals' || props.view === 'doctors' || props.view === 'treatments') && getAvailableTreatmentOptions().length > 0 && (
            <FilterDropdown
              value={props.treatmentQuery}
              onChange={props.setTreatmentQuery}
              placeholder="Search by treatment name"
              options={getAvailableTreatmentOptions()}
              selectedOption={props.selectedTreatmentId}
              onOptionSelect={props.setSelectedTreatmentId}
              onClear={() => {
                props.setTreatmentQuery("");
                props.setSelectedTreatmentId("");
              }}
              type="treatment"
            />
          )}
          {(props.view === 'hospitals' || props.view === 'doctors' || props.view === 'treatments') && getAvailableCityOptions().length > 0 && (
            <FilterDropdown
              value={props.cityQuery}
              onChange={props.setCityQuery}
              placeholder="Search by city name"
              options={getAvailableCityOptions()}
              selectedOption={props.selectedCityId}
              onOptionSelect={props.setSelectedCityId}
              onClear={() => {
                props.setCityQuery("");
                props.setSelectedCityId("");
              }}
              type="city"
            />
          )}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={props.clearFilters}
              className="w-full bg-white text-gray-700 py-3 rounded-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Helper: Extract specialization matching logic
const matchesSpecialization = (doctorSpecs: any, specId: string, lowerSpec: string): boolean => {
  if (!doctorSpecs) return false;
  if (Array.isArray(doctorSpecs)) {
    return doctorSpecs.some((spec: any) => {
      if (specId) {
        return typeof spec === 'object' ? spec._id === specId : spec === specId;
      } else {
        const name = typeof spec === 'object' ? spec.name : spec;
        return name && name.toLowerCase().includes(lowerSpec);
      }
    });
  }
  if (typeof doctorSpecs === 'string') {
    if (specId) return doctorSpecs === specId;
    return doctorSpecs.toLowerCase().includes(lowerSpec);
  }
  return false;
};

// Helper: Get branches matching filters
const getMatchingBranches = (
  hospitals: HospitalType[],
  selectedBranchId: string,
  branchQuery: string,
  selectedCityId: string,
  cityQuery: string,
  selectedTreatmentId: string,
  treatmentQuery: string
): BranchType[] => {
  const branchesData: BranchType[] = [];
  hospitals.forEach((hospital) => {
    hospital.branches?.forEach((branch) => {
      if (selectedBranchId && branch._id !== selectedBranchId) return;
      if (branchQuery) {
        const lowerBranch = branchQuery.toLowerCase();
        if (!branch.name.toLowerCase().includes(lowerBranch)) return;
      }

      let matchesCity = true;
      if (selectedCityId) {
        matchesCity = branch.city?.some((c: CityType) => c._id === selectedCityId) || false;
      } else if (cityQuery) {
        const lowerCity = cityQuery.toLowerCase();
        matchesCity = branch.city?.some((c: CityType) => c.name.toLowerCase().includes(lowerCity)) || false;
      }
      if (!matchesCity) return;

      let matchesTreatment = true;
      if (selectedTreatmentId) {
        matchesTreatment = branch.treatments.some((t: TreatmentType) => t._id === selectedTreatmentId);
      } else if (treatmentQuery) {
        const lowerTreatment = treatmentQuery.toLowerCase();
        matchesTreatment = branch.treatments.some((t: TreatmentType) => t.name.toLowerCase().includes(lowerTreatment));
      }
      if (!matchesTreatment) return;

      branchesData.push(branch);
    });
  });
  return branchesData;
};

// Helper: Get unique options from branches
const getUniqueOptionsFromBranches = (branches: BranchType[], field: 'city' | 'treatments'): { id: string; name: string }[] => {
  const map = new Map<string, string>();
  branches.forEach((branch) => {
    if (field === 'city') {
      branch.city?.forEach((c) => {
        if (c._id && c.name) map.set(c._id, c.name);
      });
    } else if (field === 'treatments') {
      branch.treatments?.forEach((t) => {
        if (t._id && t.name) map.set(t._id, t.name);
      });
    }
  });
  return Array.from(map).map(([id, name]) => ({ id, name })).filter((o) => o.name);
};

// Helper: Get extended items for doctors/treatments
const getExtendedItems = <T extends DoctorType | TreatmentType>(
  hospitals: HospitalType[],
  selectedBranchId: string,
  branchQuery: string,
  selectedCityId: string,
  cityQuery: string,
  selectedTreatmentId: string,
  treatmentQuery: string,
  itemExtractor: (hospital: HospitalType) => T[],
  branchExtractor: (branch: BranchType) => T[],
  extendFn: (item: T, hospital: HospitalType, branch?: BranchType) => any,
  filterFn?: (item: any) => boolean
): any[] => {
  const map = new Map<string, any>();
  hospitals.forEach((hospital) => {
    // Hospital-level items
    let hospitalMatchesCity = true;
    if (selectedCityId || cityQuery) {
      hospitalMatchesCity = hospital.branches.some((b: BranchType) => {
        if (selectedCityId) {
          return b.city?.some((c: CityType) => c._id === selectedCityId) || false;
        } else if (cityQuery) {
          const lowerCity = cityQuery.toLowerCase();
          return b.city?.some((c: CityType) => c.name.toLowerCase().includes(lowerCity)) || false;
        }
        return false;
      });
    }

    let hospitalMatchesTreatment = true;
    if (selectedTreatmentId || treatmentQuery) {
      hospitalMatchesTreatment = hospital.branches.some((b: BranchType) =>
        b.treatments.some((t: TreatmentType) =>
          selectedTreatmentId ? t._id === selectedTreatmentId : t.name.toLowerCase().includes(treatmentQuery.toLowerCase())
        )
      );
    }

    let hospitalMatchesBranch = true;
    if (branchQuery) {
      hospitalMatchesBranch = hospital.name.toLowerCase().includes(branchQuery.toLowerCase());
    }

    if (hospitalMatchesCity && hospitalMatchesTreatment && hospitalMatchesBranch && !selectedBranchId) {
      itemExtractor(hospital).forEach((item: T) => {
        const extended = extendFn(item, hospital);
        map.set(item._id, extended);
      });
    }

    // Branch-level items
    hospital.branches?.forEach((branch: BranchType) => {
      if (selectedBranchId && branch._id !== selectedBranchId) return;
      if (branchQuery) {
        const lowerBranch = branchQuery.toLowerCase();
        if (!branch.name.toLowerCase().includes(lowerBranch)) return;
      }

      let matchesCity = true;
      if (selectedCityId) {
        matchesCity = branch.city?.some((c: CityType) => c._id === selectedCityId) || false;
      } else if (cityQuery) {
        const lowerCity = cityQuery.toLowerCase();
        matchesCity = branch.city?.some((c: CityType) => c.name.toLowerCase().includes(lowerCity)) || false;
      }
      if (!matchesCity) return;

      let matchesTreatment = true;
      if (selectedTreatmentId || treatmentQuery) {
        matchesTreatment = branch.treatments.some((t: TreatmentType) =>
          selectedTreatmentId ? t._id === selectedTreatmentId : t.name.toLowerCase().includes(treatmentQuery.toLowerCase())
        );
      }
      if (!matchesTreatment) return;

      branchExtractor(branch).forEach((item: T) => {
        const extended = extendFn(item, hospital, branch);
        const existing = map.get(item._id);
        if (!existing?.branchId) {
          map.set(item._id, extended);
        }
      });
    });
  });

  let items = Array.from(map.values());
  if (filterFn) {
    items = items.filter(filterFn);
  }
  return items;
};

// Main Content Component
const HospitalDirectoryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'hospitals' | 'doctors' | 'treatments'>('hospitals');
  const [branchQuery, setBranchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [treatmentQuery, setTreatmentQuery] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedTreatmentId, setSelectedTreatmentId] = useState('');
  const [doctorQuery, setDoctorQuery] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [specializationQuery, setSpecializationQuery] = useState('');
  const [selectedSpecializationId, setSelectedSpecializationId] = useState('');
  const [sortBy, setSortBy] = useState<'all' | 'popular' | 'az' | 'za'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFilters]);

  // Initialize filters from URL params
  useEffect(() => {
    const viewParam = searchParams.get('view') || 'hospitals';
    setView(viewParam as 'hospitals' | 'doctors' | 'treatments');

    const branchParam = searchParams.get('branch') || '';
    if (isUUID(branchParam)) {
      setSelectedBranchId(branchParam);
      setBranchQuery('');
    } else {
      setSelectedBranchId('');
      setBranchQuery(branchParam);
    }

    const cityParam = searchParams.get('city') || '';
    if (isUUID(cityParam)) {
      setSelectedCityId(cityParam);
      setCityQuery('');
    } else {
      setSelectedCityId('');
      setCityQuery(cityParam);
    }

    const treatmentParam = searchParams.get('treatment') || '';
    if (isUUID(treatmentParam)) {
      setSelectedTreatmentId(treatmentParam);
      setTreatmentQuery('');
    } else {
      setSelectedTreatmentId('');
      setTreatmentQuery(treatmentParam);
    }

    const doctorParam = searchParams.get('doctor') || '';
    if (isUUID(doctorParam)) {
      setSelectedDoctorId(doctorParam);
      setDoctorQuery('');
    } else {
      setSelectedDoctorId('');
      setDoctorQuery(doctorParam);
    }

    const specializationParam = searchParams.get('specialization') || '';
    if (isUUID(specializationParam)) {
      setSelectedSpecializationId(specializationParam);
      setSpecializationQuery('');
    } else {
      setSelectedSpecializationId('');
      setSpecializationQuery(specializationParam);
    }
  }, [searchParams]);

  // Debounced URL sync
  useEffect(() => {
    const timer = setTimeout(() => {
      const params: string[] = [];
      if (view !== 'hospitals') {
        params.push(`view=${view}`);
      }
      if (selectedBranchId || branchQuery) {
        params.push(`branch=${encodeURIComponent(selectedBranchId || branchQuery)}`);
      }
      if (selectedCityId || cityQuery) {
        params.push(`city=${encodeURIComponent(selectedCityId || cityQuery)}`);
      }
      if (selectedTreatmentId || treatmentQuery) {
        params.push(`treatment=${encodeURIComponent(selectedTreatmentId || treatmentQuery)}`);
      }
      if (view === 'doctors') {
        if (selectedDoctorId || doctorQuery) {
          params.push(`doctor=${encodeURIComponent(selectedDoctorId || doctorQuery)}`);
        }
        if (selectedSpecializationId || specializationQuery) {
          params.push(`specialization=${encodeURIComponent(selectedSpecializationId || specializationQuery)}`);
        }
      }
      const queryString = params.length > 0 ? '?' + params.join('&') : '';
      router.replace(`/hospitals${queryString}`, { scroll: false });
    }, 800);
    return () => clearTimeout(timer);
  }, [
    branchQuery,
    selectedBranchId,
    cityQuery,
    selectedCityId,
    treatmentQuery,
    selectedTreatmentId,
    doctorQuery,
    selectedDoctorId,
    specializationQuery,
    selectedSpecializationId,
    view,
    router,
  ]);

  // Fetch data with real-time cache busting
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`/api/hospitals?pageSize=200&_t=${Date.now()}`, {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Failed to fetch hospitals: ${res.status}`);
      const data = await res.json();

      setHospitals(data.items || []);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("[HospitalDirectory] Error fetching hospitals:", err);
        setHospitals([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Faceted options for branch (ignore branch filter)
  const tempBranchesForBranchOptions = useMemo(
    () => getMatchingBranches(hospitals, '', '', selectedCityId, cityQuery, selectedTreatmentId, treatmentQuery),
    [hospitals, selectedCityId, cityQuery, selectedTreatmentId, treatmentQuery]
  );
  const availableBranchOptions = useMemo(
    () => tempBranchesForBranchOptions.map(b => ({ id: b._id, name: b.name })).filter(o => o.name),
    [tempBranchesForBranchOptions]
  );

  // Faceted options for city (ignore city filter, include branch and treatment)
  const tempBranchesForCityOptions = useMemo(
    () => getMatchingBranches(hospitals, selectedBranchId, branchQuery, '', '', selectedTreatmentId, treatmentQuery),
    [hospitals, selectedBranchId, branchQuery, selectedTreatmentId, treatmentQuery]
  );
  const availableCityOptionsBase = useMemo(
    () => getUniqueOptionsFromBranches(tempBranchesForCityOptions, 'city'),
    [tempBranchesForCityOptions]
  );

  // Faceted options for treatment (ignore treatment filter, include branch and city)
  const tempBranchesForTreatmentOptions = useMemo(
    () => getMatchingBranches(hospitals, selectedBranchId, branchQuery, selectedCityId, cityQuery, '', ''),
    [hospitals, selectedBranchId, branchQuery, selectedCityId, cityQuery]
  );
  const availableTreatmentOptionsBase = useMemo(
    () => getUniqueOptionsFromBranches(tempBranchesForTreatmentOptions, 'treatments'),
    [tempBranchesForTreatmentOptions]
  );

  // For treatments view: facet options ignoring their filters
  const tempTreatmentsForTreatmentOptions = useMemo(() => getExtendedItems(
    hospitals,
    selectedBranchId,
    branchQuery,
    selectedCityId,
    cityQuery,
    '',
    '',
    (h) => h.treatments || [],
    (b) => b.treatments || [],
    (item, hospital, branch) => ({ ...item, hospitalName: hospital.name, branchName: branch?.name, branchId: branch?._id }),
    undefined
  ), [hospitals, selectedBranchId, branchQuery, selectedCityId, cityQuery]);

  const availableTreatmentOptionsTreatments = useMemo(
    () => tempTreatmentsForTreatmentOptions.map(t => ({ id: t._id, name: t.name })).filter(o => o.name),
    [tempTreatmentsForTreatmentOptions]
  );

  const tempTreatmentsForCityOptions = useMemo(() => getExtendedItems(
    hospitals,
    selectedBranchId,
    branchQuery,
    '',
    '',
    selectedTreatmentId,
    treatmentQuery,
    (h) => h.treatments || [],
    (b) => b.treatments || [],
    (item, hospital, branch) => ({ ...item, hospitalName: hospital.name, branchName: branch?.name, branchId: branch?._id }),
    (t: ExtendedTreatmentType) => {
      if (selectedTreatmentId) return t._id === selectedTreatmentId;
      if (treatmentQuery) {
        const lower = treatmentQuery.toLowerCase();
        return t.name.toLowerCase().includes(lower);
      }
      return true;
    }
  ), [hospitals, selectedBranchId, branchQuery, selectedTreatmentId, treatmentQuery]);

  const availableCityOptionsTreatments = useMemo(() => {
    const branchIds = [...new Set(tempTreatmentsForCityOptions.filter((t: any) => t.branchId).map((t: any) => t.branchId))];
    const relevantBranches = hospitals.flatMap(h => h.branches || []).filter(b => branchIds.includes(b._id));
    return getUniqueOptionsFromBranches(relevantBranches, 'city');
  }, [tempTreatmentsForCityOptions, hospitals]);

  // For doctors view: facet options ignoring their respective filters
  const tempDoctorsForOptions = useMemo(() => {
    return getExtendedItems(
      hospitals,
      selectedBranchId,
      branchQuery,
      selectedCityId,
      cityQuery,
      selectedTreatmentId,
      treatmentQuery,
      (h) => h.doctors || [],
      (b) => b.doctors || [],
      (item, hospital, branch) => ({ ...item, hospitalName: hospital.name, branchName: branch?.name, branchId: branch?._id }),
      (d: ExtendedDoctorType) => {
        if (selectedDoctorId) return d._id === selectedDoctorId;
        if (doctorQuery && !d.name.toLowerCase().includes(doctorQuery.toLowerCase())) return false;

        const lowerSpec = specializationQuery.toLowerCase();
        if (selectedSpecializationId || specializationQuery) {
          return matchesSpecialization(d.specialization, selectedSpecializationId, lowerSpec);
        }
        return true;
      }
    );
  }, [
    hospitals,
    selectedBranchId,
    branchQuery,
    selectedCityId,
    cityQuery,
    selectedTreatmentId,
    treatmentQuery,
    selectedDoctorId,
    doctorQuery,
    selectedSpecializationId,
    specializationQuery,
  ]);

  // Ignore doctor filter for doctor options
  const tempDoctorsForDoctorOptions = useMemo(() => {
    return getExtendedItems(
      hospitals,
      selectedBranchId,
      branchQuery,
      selectedCityId,
      cityQuery,
      selectedTreatmentId,
      treatmentQuery,
      (h) => h.doctors || [],
      (b) => b.doctors || [],
      (item, hospital, branch) => ({ ...item, hospitalName: hospital.name, branchName: branch?.name, branchId: branch?._id }),
      (d: ExtendedDoctorType) => {
        // Skip doctor filter
        const lowerSpec = specializationQuery.toLowerCase();
        if (selectedSpecializationId || specializationQuery) {
          return matchesSpecialization(d.specialization, selectedSpecializationId, lowerSpec);
        }
        return true;
      }
    );
  }, [
    hospitals,
    selectedBranchId,
    branchQuery,
    selectedCityId,
    cityQuery,
    selectedTreatmentId,
    treatmentQuery,
    selectedSpecializationId,
    specializationQuery,
  ]);

  const availableDoctorOptions = useMemo(
    () => tempDoctorsForDoctorOptions.map(d => ({ id: d._id, name: d.name })).filter(o => o.name),
    [tempDoctorsForDoctorOptions]
  );

  // Ignore spec filter for spec options
  const tempDoctorsForSpecOptions = useMemo(() => {
    return getExtendedItems(
      hospitals,
      selectedBranchId,
      branchQuery,
      selectedCityId,
      cityQuery,
      selectedTreatmentId,
      treatmentQuery,
      (h) => h.doctors || [],
      (b) => b.doctors || [],
      (item, hospital, branch) => ({ ...item, hospitalName: hospital.name, branchName: branch?.name, branchId: branch?._id }),
      (d: ExtendedDoctorType) => {
        if (selectedDoctorId) return d._id === selectedDoctorId;
        if (doctorQuery && !d.name.toLowerCase().includes(doctorQuery.toLowerCase())) return false;
        // Skip spec filter
        return true;
      }
    );
  }, [
    hospitals,
    selectedBranchId,
    branchQuery,
    selectedCityId,
    cityQuery,
    selectedTreatmentId,
    treatmentQuery,
    selectedDoctorId,
    doctorQuery,
  ]);

  const availableSpecializationOptions = useMemo(() => {
    const specMap = new Map<string, string>();
    tempDoctorsForSpecOptions.forEach((d: any) => {
      const specs = d.specialization;
      if (Array.isArray(specs)) {
        specs.forEach((spec: any) => {
          const id = spec?._id || spec;
          const name = spec?.name || spec;
          if (id && name) specMap.set(id, name);
        });
      } else if (specs) {
        specMap.set(specs, specs);
      }
    });
    return Array.from(specMap).map(([id, name]) => ({ id, name })).filter(o => o.name);
  }, [tempDoctorsForSpecOptions]);

  // Ignore treatment filter for treatment options
  const tempDoctorsForTreatmentOptions = useMemo(() => {
    return getExtendedItems(
      hospitals,
      selectedBranchId,
      branchQuery,
      selectedCityId,
      cityQuery,
      '',
      '',
      (h) => h.doctors || [],
      (b) => b.doctors || [],
      (item, hospital, branch) => ({ ...item, hospitalName: hospital.name, branchName: branch?.name, branchId: branch?._id }),
      (d: ExtendedDoctorType) => {
        if (selectedDoctorId) return d._id === selectedDoctorId;
        if (doctorQuery && !d.name.toLowerCase().includes(doctorQuery.toLowerCase())) return false;

        const lowerSpec = specializationQuery.toLowerCase();
        if (selectedSpecializationId || specializationQuery) {
          return matchesSpecialization(d.specialization, selectedSpecializationId, lowerSpec);
        }
        return true;
      }
    );
  }, [
    hospitals,
    selectedBranchId,
    branchQuery,
    selectedCityId,
    cityQuery,
    selectedDoctorId,
    doctorQuery,
    selectedSpecializationId,
    specializationQuery,
  ]);

  const availableTreatmentOptionsDoctors = useMemo(() => {
    const branchIds = [...new Set(tempDoctorsForTreatmentOptions.filter((d: any) => d.branchId).map((d: any) => d.branchId))];
    const relevantBranches = hospitals.flatMap(h => h.branches || []).filter(b => branchIds.includes(b._id));
    let options = getUniqueOptionsFromBranches(relevantBranches, 'treatments');
    // Add hospital-level treatments
    tempDoctorsForTreatmentOptions.filter((d: any) => !d.branchId).forEach((d: any) => {
      const hospital = hospitals.find(h => h.name === d.hospitalName);
      hospital?.treatments?.forEach((t: TreatmentType) => {
        if (t._id && t.name) options.push({ id: t._id, name: t.name });
      });
    });
    const uniqueMap = new Map(options.map(o => [o.id, o]));
    return Array.from(uniqueMap.values());
  }, [tempDoctorsForTreatmentOptions, hospitals]);

  // Ignore city filter for city options
  const tempDoctorsForCityOptions = useMemo(() => {
    return getExtendedItems(
      hospitals,
      selectedBranchId,
      branchQuery,
      '',
      '',
      selectedTreatmentId,
      treatmentQuery,
      (h) => h.doctors || [],
      (b) => b.doctors || [],
      (item, hospital, branch) => ({ ...item, hospitalName: hospital.name, branchName: branch?.name, branchId: branch?._id }),
      (d: ExtendedDoctorType) => {
        if (selectedDoctorId) return d._id === selectedDoctorId;
        if (doctorQuery && !d.name.toLowerCase().includes(doctorQuery.toLowerCase())) return false;

        const lowerSpec = specializationQuery.toLowerCase();
        if (selectedSpecializationId || specializationQuery) {
          return matchesSpecialization(d.specialization, selectedSpecializationId, lowerSpec);
        }
        return true;
      }
    );
  }, [
    hospitals,
    selectedBranchId,
    branchQuery,
    selectedTreatmentId,
    treatmentQuery,
    selectedDoctorId,
    doctorQuery,
    selectedSpecializationId,
    specializationQuery,
  ]);

  const availableCityOptionsDoctors = useMemo(() => {
    const branchIds = [...new Set(tempDoctorsForCityOptions.filter((d: any) => d.branchId).map((d: any) => d.branchId))];
    const relevantBranches = hospitals.flatMap(h => h.branches || []).filter(b => branchIds.includes(b._id));
    return getUniqueOptionsFromBranches(relevantBranches, 'city');
  }, [tempDoctorsForCityOptions, hospitals]);

  // View-specific options
  const availableCityOptions = useMemo(() => {
    if (view === 'hospitals') return availableCityOptionsBase;
    if (view === 'doctors') return availableCityOptionsDoctors;
    if (view === 'treatments') return availableCityOptionsTreatments;
    return [];
  }, [view, availableCityOptionsBase, availableCityOptionsDoctors, availableCityOptionsTreatments]);

  const availableTreatmentOptions = useMemo(() => {
    if (view === 'hospitals') return availableTreatmentOptionsBase;
    if (view === 'doctors') return availableTreatmentOptionsDoctors;
    if (view === 'treatments') return availableTreatmentOptionsTreatments;
    return [];
  }, [view, availableTreatmentOptionsBase, availableTreatmentOptionsDoctors, availableTreatmentOptionsTreatments]);

  // Filtered and sorted branches (hospitals view)
  const filteredBranches = useMemo(() => {
    const branchesData = getMatchingBranches(hospitals, selectedBranchId, branchQuery, selectedCityId, cityQuery, selectedTreatmentId, treatmentQuery);
    let sorted = [...branchesData];

    if (sortBy === 'popular') {
      sorted = sorted.filter((b) => b.popular === true);
      sorted.sort((a, b) => parseInt(b.noOfDoctors || '0') - parseInt(a.noOfDoctors || '0'));
    } else if (sortBy === 'all') {
      sorted.sort((a, b) => parseInt(b.noOfDoctors || '0') - parseInt(a.noOfDoctors || '0'));
    } else if (sortBy === 'az') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [hospitals, selectedBranchId, branchQuery, selectedCityId, cityQuery, selectedTreatmentId, treatmentQuery, sortBy]);

  // Filtered and sorted doctors
  const filteredDoctors = useMemo(() => {
    let doctors = tempDoctorsForOptions; // Already computed with full filters

    if (sortBy === 'popular') {
      doctors = doctors.filter((d: ExtendedDoctorType) => d.popular === true);
      doctors.sort((a: ExtendedDoctorType, b: ExtendedDoctorType) => {
        const aExpStr = String(a.experience || '');
        const bExpStr = String(b.experience || '');
        const aExp = parseInt(aExpStr.match(/(\d+)/)?.[1] || '0');
        const bExp = parseInt(bExpStr.match(/(\d+)/)?.[1] || '0');
        return bExp - aExp;
      });
    } else if (sortBy === 'all') {
      doctors.sort((a: ExtendedDoctorType, b: ExtendedDoctorType) => {
        const aExpStr = String(a.experience || '');
        const bExpStr = String(b.experience || '');
        const aExp = parseInt(aExpStr.match(/(\d+)/)?.[1] || '0');
        const bExp = parseInt(bExpStr.match(/(\d+)/)?.[1] || '0');
        return bExp - aExp;
      });
    } else if (sortBy === 'az') {
      doctors.sort((a: ExtendedDoctorType, b: ExtendedDoctorType) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
      doctors.sort((a: ExtendedDoctorType, b: ExtendedDoctorType) => b.name.localeCompare(a.name));
    }

    return doctors;
  }, [tempDoctorsForOptions, sortBy]);

  // Filtered and sorted treatments
  const filteredTreatments = useMemo(() => {
    let treatments = getExtendedItems(
      hospitals,
      selectedBranchId,
      branchQuery,
      selectedCityId,
      cityQuery,
      selectedTreatmentId,
      treatmentQuery,
      (h) => h.treatments || [],
      (b) => b.treatments || [],
      (item, hospital, branch) => ({ ...item, hospitalName: hospital.name, branchName: branch?.name, branchId: branch?._id }),
      (t: ExtendedTreatmentType) => {
        if (selectedTreatmentId) return t._id === selectedTreatmentId;
        if (treatmentQuery) {
          const lower = treatmentQuery.toLowerCase();
          return t.name.toLowerCase().includes(lower);
        }
        return true;
      }
    );

    if (sortBy === 'popular') {
      treatments = treatments.filter((t: ExtendedTreatmentType) => t.popular === true);
      treatments.sort((a: ExtendedTreatmentType, b: ExtendedTreatmentType) => {
        const aCostStr = String(a.cost || '');
        const bCostStr = String(b.cost || '');
        const aCost = parseFloat(aCostStr.replace(/[^\d.]/g, '') || '0');
        const bCost = parseFloat(bCostStr.replace(/[^\d.]/g, '') || '0');
        return bCost - aCost;
      });
    } else if (sortBy === 'all') {
      treatments.sort((a: ExtendedTreatmentType, b: ExtendedTreatmentType) => {
        const aCostStr = String(a.cost || '');
        const bCostStr = String(b.cost || '');
        const aCost = parseFloat(aCostStr.replace(/[^\d.]/g, '') || '0');
        const bCost = parseFloat(bCostStr.replace(/[^\d.]/g, '') || '0');
        return bCost - aCost;
      });
    } else if (sortBy === 'az') {
      treatments.sort((a: ExtendedTreatmentType, b: ExtendedTreatmentType) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
      treatments.sort((a: ExtendedTreatmentType, b: ExtendedTreatmentType) => b.name.localeCompare(a.name));
    }

    return treatments;
  }, [hospitals, selectedBranchId, branchQuery, selectedCityId, cityQuery, selectedTreatmentId, treatmentQuery, sortBy]);

  const clearFilters = () => {
    setBranchQuery("");
    setCityQuery("");
    setTreatmentQuery("");
    setSelectedBranchId("");
    setSelectedCityId("");
    setSelectedTreatmentId("");
    setDoctorQuery("");
    setSelectedDoctorId("");
    setSpecializationQuery("");
    setSelectedSpecializationId("");
    router.push('/hospitals', { scroll: false });
  };

  const currentCount = (() => {
    switch (view) {
      case 'hospitals':
        return filteredBranches.length;
      case 'doctors':
        return filteredDoctors.length;
      case 'treatments':
        return filteredTreatments.length;
      default:
        return 0;
    }
  })();

  const currentViewItems = (() => {
    switch (view) {
      case 'hospitals':
        return filteredBranches;
      case 'doctors':
        return filteredDoctors;
      case 'treatments':
        return filteredTreatments;
      default:
        return [];
    }
  })();

  const isHospitalsView = view === 'hospitals';
  const isDoctorsView = view === 'doctors';
  const isTreatmentsView = view === 'treatments';

  const treatmentDisplayName = treatmentQuery || (selectedTreatmentId ? availableTreatmentOptions.find((t) => t.id === selectedTreatmentId)?.name : null);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            isHospitalsView ? (
              <HospitalCardSkeleton key={index} />
            ) : isTreatmentsView ? (
              <TreatmentCardSkeleton key={index} />
            ) : (
              <DoctorCardSkeleton key={index} />
            )
          ))}
        </div>
      );
    }
    if (currentCount === 0) {
      return <NoResults view={view} onClear={clearFilters} />;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentViewItems.map((item, index) => (
          <div key={item._id} className={`animate-in slide-in-from-bottom-2 duration-500 delay-${index * 50}ms`}>
            {isHospitalsView ? (
              <HospitalCard
                branch={item as BranchType}
                hospitalName={hospitals.find((h) => h.branches?.some((b) => b._id === item._id))?.name || "Hospital"}
                hospitalLogo={hospitals.find((h) => h.branches?.some((b) => b._id === item._id))?.logo || null}
                treatmentName={treatmentDisplayName}
              />
            ) : isDoctorsView ? (
              <DoctorCard doctor={item as ExtendedDoctorType} />
            ) : (
              <TreatmentCard treatment={item as ExtendedTreatmentType} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Banner
        topSpanText="Find the Right Hospital"
        title="Search, Compare, and Discover Trusted Hospitals Across India"
        description="Explore Medivisor India's verified hospital directory — filter by city, treatment, or branch to find the best medical care for your needs. View hospital profiles, facilities, and branch networks with accurate, up-to-date details to make confident healthcare choices."
        buttonText="Start Your Hospital Search"
        buttonLink="/hospitals"
        bannerBgImage="bg-hospital-search.png"
        mainImageSrc="/about-main.png"
        mainImageAlt="Medivisor India Hospital Search – Discover Top Hospitals Across India"
      />

      <BreadcrumbNav />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex md:px-0 px-2 flex-col lg:flex-row gap-6 py-10 lg:items-start">
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilters(false)}
            />
          )}

          <FilterSidebar
            view={view}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            clearFilters={clearFilters}
            branchQuery={branchQuery}
            setBranchQuery={setBranchQuery}
            selectedBranchId={selectedBranchId}
            setSelectedBranchId={setSelectedBranchId}
            cityQuery={cityQuery}
            setCityQuery={setCityQuery}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
            treatmentQuery={treatmentQuery}
            setTreatmentQuery={setTreatmentQuery}
            selectedTreatmentId={selectedTreatmentId}
            setSelectedTreatmentId={setSelectedTreatmentId}
            doctorQuery={doctorQuery}
            setDoctorQuery={setDoctorQuery}
            selectedDoctorId={selectedDoctorId}
            setSelectedDoctorId={setSelectedDoctorId}
            specializationQuery={specializationQuery}
            setSpecializationQuery={setSpecializationQuery}
            selectedSpecializationId={selectedSpecializationId}
            setSelectedSpecializationId={setSelectedSpecializationId}
            availableBranchOptions={availableBranchOptions}
            availableCityOptions={availableCityOptions}
            availableTreatmentOptions={availableTreatmentOptions}
            availableDoctorOptions={availableDoctorOptions}
            availableSpecializationOptions={availableSpecializationOptions}
          />

          <main className="flex-1 min-w-0 pb-20 lg:pb-0 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-0 gap-4">
              <ViewToggle view={view} setView={setView} />
              <ResultsHeader view={view} currentCount={currentCount} clearFilters={clearFilters} sortBy={sortBy} setSortBy={setSortBy} />
            </div>
            {renderContent()}
          </main>
        </div>
      </section>

      {!showFilters && <MobileFilterButton setShowFilters={setShowFilters} />}
    </div>
  );
};

// Page Component
export default function HospitalsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading hospital directory...</p>
          </div>
        </div>
      }
    >
      <HospitalDirectoryContent />
    </Suspense>
  );
}
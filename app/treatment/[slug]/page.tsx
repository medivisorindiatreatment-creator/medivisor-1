// app/treatment/[slug]/page.tsx
// Dynamic page for individual treatment details with proper hospital/doctor mapping
// Modular component-based architecture

import { findTreatmentWithHospitalsAndDoctors } from "./utils"
import HeroSection from "./components/HeroSection"
import Breadcrumb from "./components/Breadcrumb"
import OverviewSection from "./components/OverviewSection"
import HospitalsCarousel from "./components/HospitalsCarousel"
import DoctorsSection from "./components/DoctorsSection"
import LoadingState from "./components/LoadingState"
import ErrorState from "./components/ErrorState"
import ContactForm from "@/components/ContactForm"

// Enable ISR with revalidation
export const revalidate = 3600 // Revalidate every hour

interface TreatmentPageProps {
  params: Promise<{ slug: string }>
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  // Fetch treatment data on server
  const treatmentData = await findTreatmentWithHospitalsAndDoctors(slug)

  // Handle loading/error states
  if (!treatmentData) {
    return <ErrorState error="Treatment not found. The URL might be incorrect or the treatment does not exist." />
  }

  const { treatment, hospitals, allDoctors, totalHospitals, totalDoctors } = treatmentData

  // Validate required data
  if (!treatment || !treatment.name) {
    return <ErrorState error="Invalid treatment data. Please try again later." />
  }

  return (
    <div className="min-h-screen bg-gray-50 font-light">
      {/* Hero Section */}
      <HeroSection
        treatment={treatment}
        totalDoctors={totalDoctors}
        filteredDoctorsCount={allDoctors.length}
      />

      {/* Breadcrumb */}
      <Breadcrumb treatmentName={treatment.name} />

      {/* Main Content */}
      <section className="md:py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8">
            <main className="space-y-6 col-span-12 lg:col-span-9">
              {/* Treatment Overview */}
              <OverviewSection treatment={treatment} />

              {/* Hospitals Section */}
              {hospitals.length > 0 && (
                <HospitalsCarousel
                  title={treatment.name}
                  hospitals={hospitals}
                  totalHospitals={totalHospitals}
                />
              )}

              {/* Doctors Section */}
              {allDoctors.length > 0 && (
                <DoctorsSection
                  title={treatment.name}
                  doctors={allDoctors}
                  totalDoctors={totalDoctors}
                />
              )}
            </main>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-3">
              <ContactForm />
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

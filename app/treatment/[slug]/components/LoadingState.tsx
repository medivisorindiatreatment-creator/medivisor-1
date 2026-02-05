import Breadcrumb from "./Breadcrumb"

const HeroSkeleton = () => (
  <section className="relative w-full h-[70vh] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full z-10 px-4 pb-12">
      <div className="container mx-auto space-y-4">
        <div className="space-y-2">
          <div className="h-8 md:h-10 bg-gray-300 rounded w-64 md:w-96" />
          <div className="h-5 bg-gray-300 rounded w-80" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="h-8 bg-gray-300 rounded-full w-32 px-4 py-2" />
          <div className="h-8 bg-gray-300 rounded-full w-40 px-4 py-2" />
        </div>
      </div>
    </div>
  </section>
)

const OverviewSkeleton = () => (
  <div className="bg-white rounded-sm border border-gray-100 p-4 shadow-sm animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm border border-gray-100">
          <div className="w-3 h-3 bg-gray-200 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const CarouselSkeleton = () => (
  <div className="bg-white rounded-sm border border-gray-100 p-4 mb-6 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-8 bg-gray-200 rounded w-64" />
      <div className="flex gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="w-10 h-10 bg-gray-200 rounded-sm" />
        ))}
      </div>
    </div>
    <div className="overflow-hidden">
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="min-w-0 w-full md:w-[calc(33.333%-0.666rem)] flex-shrink-0 bg-white rounded-sm border border-gray-100 p-3 space-y-2 shadow-sm"
          >
            <div className="h-40 bg-gray-200 rounded-t-sm mb-2" />
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const DoctorsSkeleton = () => (
  <div className="bg-white rounded-sm border border-gray-100 p-4 shadow-sm animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
    <div className="grid md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-48 bg-gray-200 rounded-sm" />
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 2 }).map((__, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded-full w-16" />
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      ))}
    </div>
  </div>
)

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 font-light">
      <HeroSkeleton />
      <Breadcrumb treatmentName="Loading..." />
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <main className="space-y-8">
            <OverviewSkeleton />
            <CarouselSkeleton />
            <DoctorsSkeleton />
          </main>
        </div>
      </section>
    </div>
  )
}

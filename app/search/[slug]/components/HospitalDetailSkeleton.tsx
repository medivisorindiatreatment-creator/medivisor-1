"use client"

const HospitalDetailSkeleton = () => (
  <div className={`min-h-screen bg-gray-50`}>
    <div className="relative w-full h-[55vh] md:h-[65vh] bg-gray-300 animate-pulse" />

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-white border-b border-gray-100 shadow-sm">
      <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse" />
    </div>

    <section className="py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <main className="lg:col-span-9 space-y-10 md:space-y-8">
            <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-8 shadow-md animate-pulse">
              <div className="h-7 w-64 bg-gray-200 rounded-lg mb-6" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-11/12 bg-gray-100 rounded" />
                <div className="h-4 w-10/12 bg-gray-100 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 rounded" />
              </div>
            </div>

            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-6 pt-4 bg-white rounded-xl border border-gray-100 p-4 md:p-8 shadow-md">
                <div className="h-8 w-72 bg-gray-200 rounded mb-4" />
                <div className="flex gap-6 overflow-hidden">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                      <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden h-72 animate-pulse">
                        <div className="h-40 bg-gray-200" />
                        <div className="p-4 space-y-2">
                          <div className="h-5 w-4/5 bg-gray-100 rounded" />
                          <div className="h-4 w-1/2 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </main>

          <aside className="lg:col-span-3 space-y-10 mt-10 lg:mt-0 animate-pulse">
            <div className="h-96 bg-white rounded-xl border border-gray-100 shadow-xl" />
          </aside>
        </div>
      </div>
    </section>
  </div>
)

export default HospitalDetailSkeleton
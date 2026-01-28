"use client"

import { Inter } from "next/font/google"
import Breadcrumb from "./Breadcrumb"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

const LoadingState = () => (
  <div className={`min-h-screen bg-white ${inter.variable} font-light`}>
    <div className="relative w-full h-[70vh] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
    </div>
    <Breadcrumb hospitalName="Hospital Name" branchName="Branch Name" hospitalSlug="" />
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8">
          <main className="lg:col-span-9 space-y-8">
            <div className="bg-white p-6 rounded-xs border border-gray-100 shadow-sm animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xs" />)}
              </div>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-50 md:p-4 p-2 rounded-xs shadow-xs border border-gray-100 animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, j) => <div key={j} className="h-60 bg-gray-200 rounded-xs" />)}
                </div>
              </div>
            ))}
          </main>
          <div className="md:col-span-3"><div className="space-y-6"><div className="bg-white p-6 rounded-xs border border-gray-100 shadow-sm animate-pulse h-96" /></div></div>
        </div>
      </div>
    </section>
  </div>
)

export default LoadingState
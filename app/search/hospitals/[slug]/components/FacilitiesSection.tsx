"use client"

import { Building2, Hospital } from "lucide-react"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

const FacilitiesSection = ({ facilities }: { facilities: any[] }) => (
  <section className={`bg-gray-50 md:p-4 p-2 rounded-xs shadow-xs border border-gray-100 ${inter.variable} font-light`}>
    <h2 className="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight mb-8 flex items-center gap-3">
      <Building2 className="w-7 h-7" /> Key Facilities
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {facilities.map((fac: any) => (
        <div key={fac._id || Math.random()} className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xs">
          <Hospital className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span className="text-sm text-gray-700 font-light">{fac.name}</span>
        </div>
      ))}
    </div>
  </section>
)

export default FacilitiesSection
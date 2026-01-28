"use client"

import { Calendar, HeartPulse, Bed, Users } from "lucide-react"
import { Inter } from "next/font/google"
import StatCard from "./StatCard"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

const OverviewSection = ({ branch, firstSpecialityName }: any) => (
  <div className={`bg-gray-50 md:p-4 p-2 rounded-xs shadow-xs border border-gray-100 ${inter.variable} font-light`}>
    <h2 className="text-2xl md:text-xl font-medium text-gray-900 tracking-tight flex items-center mb-3">Quick Overview</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      <StatCard icon={Calendar} value={branch.yearEstablished || 'N/A'} label="Established" showPlus={false} />
      <StatCard icon={HeartPulse} value={firstSpecialityName} label="Speciality" showPlus={false} />
      <StatCard icon={Bed} value={branch.totalBeds || 'N/A'} label="Beds" showPlus={true} />
      <StatCard icon={Users} value={branch.noOfDoctors || 'N/A'} label="Doctors" showPlus={true} />
    </div>
  </div>
)

export default OverviewSection
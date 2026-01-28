"use client"

import { Inter } from "next/font/google"
import classNames from "classnames"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

const StatCard = ({ icon: Icon, value, label, showPlus = true }: { icon: any; value: string | number; label: string; showPlus?: boolean }) => (
  <div className={`text-center p-4 bg-white rounded-xs border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-300 ${inter.variable} font-light flex flex-col items-center justify-center`}>
    <Icon className="w-8 h-8 text-gray-800 mb-3 flex-shrink-0" />
    <p className="text-lg font-medium text-gray-800 mb-1 leading-tight">{value}{showPlus && '+'}</p>
    <p className="text-lg font-medium text-gray-800 leading-snug">{label}</p>
  </div>
)

export default StatCard
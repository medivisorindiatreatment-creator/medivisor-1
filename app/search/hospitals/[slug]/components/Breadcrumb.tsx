"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

const Breadcrumb = ({ hospitalName, branchName, hospitalSlug }: { hospitalName: string; branchName: string; hospitalSlug: string }) => (
  <nav className={`bg-gray-100 border-b border-gray-100 py-4 ${inter.variable} font-light`}>
    <div className="container mx-auto px-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="flex items-center gap-1 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400/50 rounded-xs">
          <Home className="w-4 h-4" /> Home
        </Link>
        <span>/</span>
        <Link href="/search" className="flex items-center hover:text-gray-700 transition-colors">Hospitals</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{branchName}</span>
      </div>
    </div>
  </nav>
)

export default Breadcrumb
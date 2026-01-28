"use client"

import Link from "next/link"
import { Building2, Home } from "lucide-react"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

const ErrorState = ({ error }: { error: string | null }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative ${inter.variable} font-light`}>
    <nav className={`bg-gray-100 border-b border-gray-100 py-4 w-full absolute top-0 ${inter.variable} font-light`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="flex items-center gap-1 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400/50 rounded-xs">
            <Home className="w-4 h-4" /> Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Error</span>
        </div>
      </div>
    </nav>
    <div className="text-center space-y-6 max-w-md p-10 bg-white rounded-xs shadow-xl border border-gray-100">
      <Building2 className="w-16 h-16 text-gray-300 mx-auto" />
      <h2 className="text-2xl md:text-3xl font-medium text-gray-900 leading-tight">Branch Not Found</h2>
      <p className="text-base text-gray-700 leading-relaxed font-light">{error || "The requested branch could not be found. Please check the URL or try searching again."}</p>
      <Link href="/search" className="inline-block w-full bg-gray-700 text-white px-6 py-3 rounded-xs hover:bg-gray-800 transition-all font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50">
        Go to Hospitals Search
      </Link>
    </div>
  </div>
)

export default ErrorState
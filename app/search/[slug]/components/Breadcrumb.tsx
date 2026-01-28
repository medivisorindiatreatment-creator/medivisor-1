"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

const Breadcrumb = ({ hospitalName, hospitalSlug }: { hospitalName: string, hospitalSlug: string }) => (
  <div className={`container mx-auto px-4 bg-white sm:px-6  lg:px-8 font-light border-b border-gray-100 shadow-sm`}>
    <nav className="flex md:py-3.5 py-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-2">
        <li className="flex items-center">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/search" className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-600 transition-colors">
            Hospitals
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="ml-2 text-sm font-semibold text-gray-800 truncate max-w-[200px] md:max-w-xs block" aria-current="page">
            {hospitalName}
          </span>
        </li>
      </ol>
    </nav>
  </div>
)

export default Breadcrumb
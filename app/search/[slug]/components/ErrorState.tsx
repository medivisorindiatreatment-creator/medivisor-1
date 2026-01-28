"use client"

import Link from "next/link"
import { Hospital, ChevronLeft } from "lucide-react"

const ErrorState = ({ error }: { error: string | null }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative`}>
    <div className="absolute top-6 left-6">
      <Link href="/search" className={`flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors duration-200 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200 shadow-lg font-semibold`} >
        <ChevronLeft className="w-5 h-5" />
        Back to Search
      </Link>
    </div>
    <div className="text-center space-y-6 max-w-lg p-12 bg-white rounded-xl border border-gray-200 shadow-2xl">
      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
        <Hospital className="w-10 h-10" />
      </div>
      <h2 className={`text-3xl font-extrabold text-gray-900`}>Hospital Not Found</h2>
      <p className={`text-lg text-gray-600 leading-relaxed font-light`}>
        {error || "The requested hospital could not be found. Please verify the URL or try searching again from the main list."}
      </p>
      <Link href="/search" className={`inline-block w-full bg-gray-700 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all duration-200 shadow-lg mt-4`} >
        Go to Hospital Search
      </Link>
    </div>
  </div>
)

export default ErrorState
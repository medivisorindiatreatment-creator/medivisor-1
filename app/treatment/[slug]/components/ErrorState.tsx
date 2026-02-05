import Link from "next/link"
import { Scissors } from "lucide-react"

interface ErrorStateProps {
  error?: string
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center space-y-6 max-w-md p-8 bg-white rounded-sm border border-gray-100 shadow-sm">
        <Scissors className="w-16 h-16 text-gray-400 mx-auto" />
        <h2 className="text-2xl font-light text-gray-900">Treatment Not Found</h2>
        <p className="text-gray-600 leading-relaxed">
          {error || "The requested treatment could not be found."}
        </p>
        <Link
          href="/search?view=treatments"
          className="inline-block w-full bg-[#74BF44] text-white px-6 py-3 rounded-sm hover:bg-[#74BF44]/90 transition-all"
        >
          Browse All Treatments
        </Link>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  treatmentName: string
}

export default function Breadcrumb({ treatmentName }: BreadcrumbProps) {
  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 font-light" aria-label="Breadcrumb">
      <div className="container mx-auto flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/" className="flex items-center hover:text-[#74BF44] transition-colors" aria-label="Home">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" aria-hidden />
        <Link href="/search?view=treatments" className="hover:text-[#74BF44] transition-colors">
          Treatments
        </Link>
        <ChevronRight className="w-4 h-4" aria-hidden />
        <span aria-current="page">{treatmentName}</span>
      </div>
    </nav>
  )
}

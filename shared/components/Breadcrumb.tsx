"use client"

import Link from "next/link"
import { Home, ChevronRightIcon } from "lucide-react"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className={`bg-white border-b border-gray-100 px-4 py-3 ${inter.variable} font-extralight`} aria-label="Breadcrumb">
    <div className="container mx-auto flex items-center space-x-2 text-sm text-[#241d1f]/70">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRightIcon className="w-4 h-4" aria-hidden />}
          {item.href ? (
            <Link href={item.href} className="flex items-center hover:text-[#74BF44] transition-colors">
              {index === 0 && <Home className="w-4 h-4 mr-1" />}
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-[#241d1f] font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  </nav>
)
"use client"

import { Award } from "lucide-react"
import { getWixImageUrl } from "../utils"
import type { AccreditationType } from "../types"

const AccreditationPill = ({ acc, logoOnly = false }: { acc: AccreditationType, logoOnly?: boolean }) => {
  const logoUrl = getWixImageUrl(acc.image)

  if (logoOnly) {
    return (
      <div
        className="w-10 h-10 m-0 bg-white p-0 rounded-full shadow-lg flex items-center justify-center border border-gray-100 transition-transform hover:scale-110 tooltip"
        title={acc.title}
        aria-label={`Accreditation: ${acc.title}`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${acc.title} Logo`}
            width={32}
            height={32}
            className="w-10 h-10 object-contain rounded-full"
          />
        ) : (
          <Award className="w-5 h-5 text-yellow-500 fill-yellow-500/30" />
        )}
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-100"
      title={acc.title}
      aria-label={`Accreditation: ${acc.title}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${acc.title} Logo`}
          className="w-5 h-5 object-contain rounded-full"
        />
      ) : (
        <Award className="w-5 h-5 text-yellow-500" />
      )}
    </div>
  )
}

export default AccreditationPill
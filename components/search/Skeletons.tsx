"use client"

import React from "react"

export const HospitalCardSkeleton = () => (
  <div className="bg-white rounded-xs shadow-md overflow-hidden animate-pulse border border-gray-100">
    <div className="h-48 bg-gray-50 relative">
      <div className="absolute bottom-3 left-3 bg-gray-100 rounded-xs w-12 h-12 border border-white" />
    </div>
    <div className="p-5 space-y-4">
      <div className="h-6 bg-gray-100 rounded-md w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded-md w-1/4" />
        <div className="h-4 bg-gray-100 rounded-md w-3/4" />
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-xs p-3 h-16" />
        ))}
      </div>
    </div>
  </div>
)

export const DoctorCardSkeleton = () => (
  <div className="bg-white rounded-xs shadow-md overflow-hidden animate-pulse border border-gray-100">
    <div className="h-48 bg-gray-50 relative" />
    <div className="p-5 space-y-4">
      <div className="h-6 bg-gray-100 rounded-md w-3/4" />
      <div className="h-4 bg-gray-100 rounded-md w-1/2" />
      <div className="h-3 bg-gray-100 rounded-md w-full" />
      <div className="space-y-2 border-t border-gray-50 pt-3">
        <div className="h-3 bg-gray-100 rounded-md w-3/4" />
        <div className="h-3 bg-gray-100 rounded-md w-1/2" />
      </div>
    </div>
  </div>
)

export const TreatmentCardSkeleton = () => (
  <div className="bg-white rounded-xs shadow-md overflow-hidden animate-pulse border border-gray-100">
    <div className="h-48 bg-gray-50 relative" />
    <div className="p-5 space-y-4">
      <div className="h-6 bg-gray-100 rounded-md w-3/4" />
      <div className="h-4 bg-gray-100 rounded-md w-1/2" />
      <div className="space-y-2 border-t border-gray-50 pt-3">
        <div className="h-3 bg-gray-100 rounded-md w-3/4" />
        <div className="h-3 bg-gray-100 rounded-md w-1/2" />
      </div>
    </div>
  </div>
)

export const BranchCardSkeleton = () => (
  <div className="bg-white rounded-xs shadow-lg overflow-hidden animate-pulse border border-gray-200">
    <div className="h-72 md:h-48 bg-gray-50 relative">
      <div className="absolute bottom-2 left-2 bg-gray-100 rounded-xs w-12 h-12" />
    </div>
    <div className="p-3 space-y-4">
      <div className="h-6 bg-gray-100 rounded-md w-3/4" />
      <div className="h-4 bg-gray-100 rounded-md w-1/2" />
      <div className="h-4 bg-gray-100 rounded-md w-1/3" />
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-xs p-2 h-16 border border-gray-100" />
        ))}
      </div>
    </div>
  </div>
)
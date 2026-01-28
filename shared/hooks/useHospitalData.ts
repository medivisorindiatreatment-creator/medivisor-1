"use client"

import { useState, useEffect } from "react"
import { getAllExtendedTreatments, getAllExtendedDoctors } from "../utils"

interface Hospital {
  _id: string
  hospitalName: string
  logo: string | null
  yearEstablished: string | null
  description: string | null
  branches: any[]
  doctors: any[]
  treatments: any[]
  departments?: any[]
}

interface Treatment {
  _id: string
  name: string
  description: string | null
  category: string | null
  duration: string | null
  cost: string | null
  treatmentImage?: string | null
  branchesAvailableAt: any[]
  departments: any[]
}

interface Doctor {
  _id: string
  doctorName: string
  specialization: any[]
  qualification: string | null
  experienceYears: string | null
  designation: string | null
  aboutDoctor: string | null
  profileImage: string | null
  popular?: boolean
  locations: any[]
  departments: any[]
  relatedTreatments?: any[]
}

interface UseHospitalDataResult {
  hospitals: Hospital[]
  treatments: Treatment[]
  doctors: Doctor[]
  loading: boolean
  error: string | null
}

export const useHospitalData = (pageSize: number = 1000): UseHospitalDataResult => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/hospitals?pageSize=${pageSize}`)
        if (!res.ok) throw new Error("Failed to fetch hospitals")

        const data = await res.json()
        const hospitalsData: Hospital[] = data.items

        const extendedTreatments = getAllExtendedTreatments(hospitalsData)
        const extendedDoctors = getAllExtendedDoctors(hospitalsData)

        setHospitals(hospitalsData)
        setTreatments(extendedTreatments)
        setDoctors(extendedDoctors)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [pageSize])

  return { hospitals, treatments, doctors, loading, error }
}
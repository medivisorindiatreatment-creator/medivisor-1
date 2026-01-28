import type { HospitalType } from '@/types/search'

export async function fetchHospitalsData(): Promise<HospitalType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/hospitals?pageSize=1000`, {
      next: { revalidate: 3600 } // ISR caching
    })

    if (!res.ok) {
      throw new Error('Failed to fetch hospitals data')
    }

    const data = await res.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching hospitals data:', error)
    return []
  }
}

// For paginated fetching (future enhancement)
export async function fetchHospitalsPaginated(page: number = 1, pageSize: number = 20): Promise<{ items: HospitalType[], total: number, hasMore: boolean }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/hospitals?page=${page}&pageSize=${pageSize}`, {
      next: { revalidate: 3600 }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch paginated hospitals data')
    }

    const data = await res.json()
    return {
      items: data.items || [],
      total: data.total || 0,
      hasMore: (page * pageSize) < (data.total || 0)
    }
  } catch (error) {
    console.error('Error fetching paginated hospitals data:', error)
    return { items: [], total: 0, hasMore: false }
  }
}
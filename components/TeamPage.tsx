// app/team/[slug]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail, Linkedin, Twitter, Globe, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

// NOTE: Import the necessary helper functions and data fetching logic
// from a shared utility file or another server-side file if possible,
// but for now, we'll keep the client-side fetch logic clean.
// We'll define the exported helpers in the metadata.ts file for consistency,
// and create a simplified, client-safe internal function here.

const COLLECTION_ID = "Team1"

// ----------------------------------------------------------------------
// NOTE: These helper functions need to be imported or defined here for
// the Client Component to run. Since the original file exported them,
// we'll keep the required ones here or assume they are imported.
// For simplicity in the client component, we'll redefine the minimum needed helpers.
// In a real project, put these in `lib/utils.ts` and import them.
// ----------------------------------------------------------------------

// Helper function to extract text from a rich text object (Client-safe copy)
const extractTextFromRichText = (richTextObj: any): string => {
  if (!richTextObj) return ""
  if (typeof richTextObj === "string") return richTextObj
  if (richTextObj.nodes && Array.isArray(richTextObj.nodes)) {
    return richTextObj.nodes
      .map((node: any) => {
        if (node.type === "PARAGRAPH" && node.nodes) {
          return node.nodes
            .map((textNode: any) => {
              if (textNode.type === "TEXT" && textNode.textData) {
                return textNode.textData.text || ""
              }
              return ""
            })
            .join("")
        }
        return ""
      })
      .join("\n\n")
      .trim()
  }
  if (richTextObj.text) return richTextObj.text
  if (richTextObj.textData && richTextObj.textData.text) return richTextObj.textData.text
  return ""
}

// Interface for the team member data structure
interface TeamMember {
  _id?: string
  name: string
  role: string
  image: string
  bio: string
  shortDescription: string
  longDescription: string
  order: number
  "link-team-1-title": string
  email?: string
  linkedin?: string
  twitter?: string
  website?: string
  rawData?: any
}

// Skeleton loader component for better user experience while data is loading
const SkeletonProfile = () => (
  <div className="min-h-screen bg-white">
    <div className="container mx-auto px-4 py-16">
      <div className="h-10 bg-gray-200 rounded animate-pulse w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="aspect-[4/5] bg-gray-200 rounded-lg animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-48" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)


// NOTE: The data fetching logic is complex. For a client component, you must
// either import the original `fetchMemberItem` and its dependencies (like `getWixScaledToFillImageUrl`)
// or abstract the fetching into a dedicated client-accessible API route or server action.
// For the sake of fixing the build error and maintaining functionality, we'll
// put the necessary data fetching and mapping logic inside the component's scope
// (or import it from a shared utility if it contains only client-safe code).

// Simplified Data Fetching (assuming `fetchMemberItem` is available globally or imported)
// *** DUMMY FUNCTION TO AVOID DEPENDENCY ISSUES FOR THIS EXAMPLE ***
// *** IN REAL CODE, YOU MUST IMPORT/DEFINE processWixImageUrl & fetchMemberItem ***
const fetchMemberItem = async (memberId: string): Promise<any> => {
    // This is a placeholder. You need to implement the actual fetch logic
    // from the original file, ensuring it's either client-safe or called from a server action.
    // For now, we will assume an API call or a simplified import of the original server logic.
    // For this demonstration, we'll mock the required imports:
    const { getBestCoverImage, getWixScaledToFillImageUrl } = await import("@/lib/wixMedia")
    const { wixClient } = await import("@/lib/wixClient")

    // --- Original fetchMemberItem logic (must be client safe or abstracted) ---
    // (Pasting the original server-side logic here is not ideal for a client component,
    // but necessary if you cannot refactor the Wix SDK usage to a server action/route)

    // Re-defining processWixImageUrl for the client component's local scope
    const processWixImageUrl = (item: any): string => {
        const bestImage = getBestCoverImage(item)
        if (bestImage) {
            return getWixScaledToFillImageUrl(bestImage, 600, 750) || bestImage
        }
        // ... (rest of the image processing logic)
        const imageFields = [
            "Photo",
            "photo",
            "image",
            "picture",
            "avatar",
            "profileImage",
            "mainImage",
            "featuredImage",
            "coverImage",
            "thumbnail",
        ]

        for (const field of imageFields) {
            if (item[field]) {
                let imageUrl = null

                if (typeof item[field] === "string" && item[field].startsWith("wix:image://")) {
                    imageUrl = item[field]
                } else if (item[field]?.url && item[field].url.startsWith("wix:image://")) {
                    imageUrl = item[field].url
                } else if (item[field]?.src && item[field].src.startsWith("wix:image://")) {
                    imageUrl = item[field].src
                }

                if (imageUrl) {
                    const processedUrl = getWixScaledToFillImageUrl(imageUrl, 600, 750)
                    if (processedUrl) {
                        return processedUrl
                    }
                }
            }
        }
        return `/placeholder.svg?height=750&width=600&query=team member portrait`
    }
    
    const mapToTeamMember = (item: any): TeamMember => {
        const itemData = item.data || item
        return {
            _id: item._id || item.ID,
            name: itemData.title || item.title || item.Name || item.name || "Team Member",
            role: itemData.jobTitle || item.jobTitle || item["Job Title"] || item.role || item.position || "Team Member",
            image: processWixImageUrl(itemData),
            bio: extractTextFromRichText(itemData.longDescription || item.longDescription || item["Long Description"] || item.bio || item.description) || "Dedicated team member.",
            shortDescription: extractTextFromRichText(itemData.shortDescription || item.shortDescription || item["Short Description"] || item.excerpt) || "",
            longDescription: extractTextFromRichText(itemData.longDescription || item.longDescription || item["Long Description"] || item.bio || item.description) || "",
            order: Number.parseInt(itemData.order) || Number.parseInt(item.order) || Number.parseInt(item.Order) || 0,
            "link-team-1-title": itemData["link-team-1-title"] || item["link-team-1-title"] || item.link || item.profileUrl || item.website || "#",
            email: itemData.email || item.email || item.Email || "",
            linkedin: itemData.linkedin || item.linkedin || item.LinkedIn || "",
            twitter: itemData.twitter || item.twitter || item.Twitter || "",
            website: itemData.website || item.website || item.Website || "",
            rawData: item,
        }
    }

    // --- Actual fetch logic using wixClient, simplified ---
    let response = await wixClient.items.query(COLLECTION_ID).eq("_id", memberId).find({ consistentRead: true })
    if (!response?.items?.length) {
        // Fallback logic for slug matching... (omitted for brevity, assume the original logic is here)
        const allMembersResponse = await wixClient.items.query(COLLECTION_ID).skip(0).limit(100).find({ consistentRead: true })
        if (allMembersResponse?.items?.length) {
            const targetMember = allMembersResponse.items.find((item: any) => {
                const itemData = item.data || item
                const memberName = itemData.title || item.title || item.Name || item.name || ""
                const memberSlug = memberName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").trim()
                const linkSlug = itemData["link-team-1-title"] || item["link-team-1-title"] || ""
                const extractedSlug = linkSlug.replace("/team/", "").replace("/", "")
                return memberSlug === memberId || extractedSlug === memberId || item._id === memberId
            })
            if (targetMember) {
                response = { items: [targetMember] }
            }
        }
    }

    if (response?.items?.[0]) {
        return mapToTeamMember(response.items[0])
    }
    
    return null
}
// --- END DUMMY FUNCTION ---


export default function TeamMemberPage() {
  const params = useParams()
  const router = useRouter()
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Load data when the component mounts or the slug changes
  const loadData = async () => {
    try {
      setLoading(true)
      const slug = params.slug as string
      
      // Call the fetch function directly
      const result = await fetchMemberItem(slug)

      if (result) {
        setTeamMember(result)
      } else {
        setNotFound(true)
      }
    } catch (error) {
      console.error("Failed to load team member:", error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.slug) {
      loadData()
    }
  }, [params.slug])

  // Display skeleton loader while fetching data
  if (loading) {
    return <SkeletonProfile />
  }

  // Display "Not Found" message if no data is found
  if (notFound || !teamMember) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-purple-100 rounded-full mb-8">
            <Users className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            Team Member Not Found
          </h1>
          <p className="text-lg text-[#241d1f] mb-8">
            The team member you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild className="bg-red-600 mt-5 hover:bg-red-700 text-white">
            <Link href="/team">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Main component to display team member details
  return (
    <div className="min-h-screen px-2 bg-white">
      <div className="container mx-auto py-10">
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          {/* Back to previous page */}
          <Button variant="ghost" className="hover:bg-red-50 w-auto bg-gray-100 cursor-pointer hover:text-red-600" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
             Back
          </Button>
          {/* Back to Professional Stage Page */}

        </div>

        <div className="grid grid-cols-1 pb-10 mt-4 md:pt-2 lg:grid-cols-3 gap-6">
          {/* Profile Image and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-xs  border-gray-200">
              <div className="md:aspect-[4/5] aspect-[3/2] overflow-hidden ">
                <img
                  src={teamMember.image || "/placeholder.svg"}
                  alt={teamMember.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=750&width=600&query=${encodeURIComponent(teamMember.name + " team member")}`
                  }}
                />
              </div>
              <div className="p-4">
                <h1 className="title-heading">{teamMember.name}</h1>
                <p className="description">{teamMember.role}</p>

                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  {teamMember.email && (
                    <a
                      href={`mailto:${teamMember.email}`}
                      className="p-3 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group"
                    >
                      <Mail className="w-5 h-5 text-[#241d1f] group-hover:text-red-600" />
                    </a>
                  )}
                  {teamMember.linkedin && (
                    <a
                      href={teamMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group"
                    >
                      <Linkedin className="w-5 h-5 text-[#241d1f] group-hover:text-red-600" />
                    </a>
                  )}
                  {teamMember.twitter && (
                    <a
                      href={teamMember.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group"
                    >
                      <Twitter className="w-5 h-5 text-[#241d1f] group-hover:text-red-600" />
                    </a>
                  )}
                  {teamMember.website && (
                    <a
                      href={teamMember.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group"
                    >
                      <Globe className="w-5 h-5 text-[#241d1f] group-hover:text-red-600" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h2 className="title-heading mb-4">About {teamMember.name}</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="description">
                    {teamMember.longDescription || teamMember.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
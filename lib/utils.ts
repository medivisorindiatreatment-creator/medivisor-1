import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { media } from "@wix/sdk" // Import media from wix-sdk

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get YouTube embed URL from a regular YouTube URL
export function getYouTubeEmbedUrl(youtubeUrl: string | undefined): string | null {
  if (!youtubeUrl) return null

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = youtubeUrl.match(regExp)

  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=0&modestbranding=1&rel=0`
  }
  return null
}

// Helper function to get Wix Media URL from a Wix Media ID
// This function assumes the ID is in the format "11062b_..." or similar.
// It constructs the full Wix image URL.
export function getWixMediaUrlFromId(mediaId: string, width?: number, height?: number): string {
  if (!mediaId) {
    console.warn("getWixMediaUrlFromId received empty mediaId, returning placeholder.")
    return "/placeholder.svg?height=400&width=600"
  }
  try {
    // The mediaId from Ricos content often comes without the "wix:image://" prefix.
    // media.getImageUrl expects the full wix:image://<mediaId> format.
    const fullWixId = mediaId.startsWith("wix:image://") ? mediaId : `wix:image://${mediaId}`
    const { url } = media.getImageUrl(fullWixId)

    // You can append width/height parameters if media.getImageUrl doesn't handle it directly
    // For now, we rely on media.getImageUrl to provide the correct base URL.
    // If you need specific sizes, you might need to parse the URL and add parameters.
    return url
  } catch (error) {
    console.error("Error getting Wix media URL from ID:", error)
    return "/placeholder.svg?height=400&width=600"
  }
}

// --- Mock Photo Album Data ---
export interface PhotoAlbum {
  id: string
  title: string
  description: string
  coverImageId: string // Wix Media ID for cover image
  imageIds: string[] // Array of Wix Media IDs for images in the album
}

// IMPORTANT: Replace these with actual Wix Media IDs from your Wix Media Manager.
// You can find these IDs by uploading images to your Wix site, then inspecting
// the image URLs (they often look like 'https://static.wixstatic.com/media/11062b_YOUR_ID.jpg').
// The ID part is '11062b_YOUR_ID.jpg' (without the 'wix:image://' prefix).
const PLACEHOLDER_WIX_IMAGE_IDS = [
  "11062b_1234567890abcdef1234567890abcdef.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder.jpg", // Example ID 1
  "11062b_fedcba0987654321fedcba0987654321.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder2.jpg", // Example ID 2
  "11062b_abcdef1234567890abcdef1234567890.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder3.jpg", // Example ID 3
  "11062b_9876543210abcdef9876543210abcdef.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder4.jpg", // Example ID 4
  "11062b_0123456789abcdef0123456789abcdef.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder5.jpg", // Example ID 5
  "11062b_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder6.jpg", // Example ID 6
  "11062b_b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder7.jpg", // Example ID 7
  "11062b_c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder8.jpg", // Example ID 8
  "11062b_d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder9.jpg", // Example ID 9
  "11062b_e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder10.jpg", // Example ID 10
  "11062b_f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder11.jpg", // Example ID 11
  "11062b_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d.jpg/v1/fill/w_640,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/placeholder12.jpg", // Example ID 12
]

export const MOCK_PHOTO_ALBUMS: PhotoAlbum[] = [
  {
    id: "nature-landscapes",
    title: "Nature Landscapes",
    description: "Breathtaking views of mountains, forests, and oceans.",
    coverImageId: PLACEHOLDER_WIX_IMAGE_IDS[0],
    imageIds: [
      PLACEHOLDER_WIX_IMAGE_IDS[0],
      PLACEHOLDER_WIX_IMAGE_IDS[1],
      PLACEHOLDER_WIX_IMAGE_IDS[2],
      PLACEHOLDER_WIX_IMAGE_IDS[3],
      PLACEHOLDER_WIX_IMAGE_IDS[4],
    ],
  },
  {
    id: "urban-exploration",
    title: "Urban Exploration",
    description: "Capturing the hidden beauty of cityscapes and abandoned places.",
    coverImageId: PLACEHOLDER_WIX_IMAGE_IDS[5],
    imageIds: [
      PLACEHOLDER_WIX_IMAGE_IDS[5],
      PLACEHOLDER_WIX_IMAGE_IDS[6],
      PLACEHOLDER_WIX_IMAGE_IDS[7],
      PLACEHOLDER_WIX_IMAGE_IDS[8],
    ],
  },
  {
    id: "portrait-photography",
    title: "Portrait Photography",
    description: "Stunning portraits showcasing diverse personalities.",
    coverImageId: PLACEHOLDER_WIX_IMAGE_IDS[9],
    imageIds: [PLACEHOLDER_WIX_IMAGE_IDS[9], PLACEHOLDER_WIX_IMAGE_IDS[10], PLACEHOLDER_WIX_IMAGE_IDS[11]],
  },
]

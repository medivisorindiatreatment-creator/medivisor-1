// lib/wix-gallery.ts

// This import is for the Wix Pro Gallery SDK.
// In a real application, you would need to install and configure this SDK.
// For this demonstration in the v0 sandbox, we will mock the 'proGallery.getGallery' call
// to simulate the response based on the provided sample data structure, as the external SDK
// might not be available or configured in this environment.
// import { proGallery } from "@wix/pro-gallery";

// Sample galleryId value: 'f18209c2-2ed5-4cbb-9cfd-45a3e6f93dbc'
export async function myGetGalleryFunction(galleryId: string) {
  try {
    // --- Start Mocking ---
    // In a real application, you would call:
    // const gallery = await proGallery.getGallery(galleryId);
    // We are mocking the response to ensure the component renders in the sandbox.
    const gallery = {
      _createdDate: "Mon Feb 08 2021 13:44:37",
      _id: galleryId, // Use the passed galleryId for consistency
      items: [
        {
          _createdDate: "Tue Mar 30 2021 15:23:22",
          _id: "534264c7-0c61-45ce-b414-891aacadf4c2",
          _updatedDate: "Tue Mar 30 2021 15:23:22",
          description: "This is a captivating video showcasing the beauty of nature.",
          sortOrder: 1657439075188,
          title: "Serene Landscape (Video)",
          type: "VIDEO",
          video: {
            type: "VIMEO",
            // Using the embed URL for Vimeo
            videoInfo: "https://player.vimeo.com/video/322240916",
            duration: 5000,
          },
        },
        {
          _createdDate: "Sun Jul 03 2022 12:05:15",
          _id: "4507a07b-ab93-4326-a222-6d0bd8da0625",
          _updatedDate: "Tues Jul 05 2022 10:25:45",
          description: "A stunning photograph of a mountain range at sunset.",
          sortOrder: 1857439076299,
          title: "Majestic Peaks (Image)",
          type: "IMAGE",
          image: {
            imageInfo:
              "wix:image://v1/25139f9568b74d8aac6286c9ac1e8186.jpg/25139f9568b74d8aac6286c9ac1e8186.jpg#originWidth=4000&originHeight=2667",
          },
        },
        {
          _createdDate: "Sun Jul 03 2022 12:05:15",
          _id: "4507a07b-ab93-4326-a222-6d0bd8da0626",
          _updatedDate: "Tues Jul 05 2022 10:25:45",
          description: "An abstract art piece with vibrant colors and dynamic shapes.",
          sortOrder: 1857439076300,
          title: "Abstract Art (Image)",
          type: "IMAGE",
          image: {
            imageInfo: "wix:image://v1/another-image.jpg/another-image.jpg#originWidth=1000&originHeight=750",
          },
        },
      ],
      name: "My Awesome Gallery",
      sortOrder: "1098567432145",
      totalItems: 3,
    }
    // --- End Mocking ---

    const id = gallery._id
    const name = gallery.name
    const items = gallery.items
    const firstItemTitle = gallery.items[0].title
    console.log("Success! Got the gallery:", gallery)
    return gallery
  } catch (error) {
    console.error(error)
    // Handle the error gracefully, e.g., by returning null or throwing a custom error
    return null
  }
}

// Define types for the gallery data structure for better type safety
export type GalleryItem = {
  _id: string
  _createdDate: string
  _updatedDate: string
  description?: string
  sortOrder: number
  title: string
  type: "VIDEO" | "IMAGE"
  video?: {
    type: string
    videoInfo: string
    duration: number
  }
  image?: {
    imageInfo: string
  }
}

export type GalleryData = {
  _createdDate: string
  _id: string
  items: GalleryItem[]
  name: string
  sortOrder: string
  totalItems: number
}

"use server"

import { wixClient } from "@/lib/wixClient" // Import your wixClient
import type { Category } from "@/types/category"
import type { proGallery } from "@wix/pro-gallery" // Import proGallery types

// --- Wix Blog Categories API Actions ---

// This function now fetches real data from Wix Blog API
export async function listCategoriesFunction(): Promise<{ categories: Category[] }> {
  try {
    const result = await wixClient.categories.listCategories()
    console.log("Retrieved Categories from Wix:", result.categories)
    return { categories: result.categories }
  } catch (error) {
    console.error("Error fetching categories from Wix:", error)
    // Return an empty array or re-throw the error depending on desired error handling
    return { categories: [] }
  }
}

// You would implement getCategory and queryCategories similarly as Server Actions
// For example:
/*
export async function getCategoryFunction(categoryId: string): Promise<Category | null> {
  try {
    const result = await wixClient.categories.getCategory(categoryId, { fieldsets: ['URL', 'SEO'] });
    console.log('Retrieved Category from Wix:', result.category);
    return result.category;
  } catch (error) {
    console.error('Error fetching single category from Wix:', error);
    return null;
  }
}

export async function queryCategoriesFunction(options?: any): Promise<{ items: Category[] }> {
  try {
    const result = await wixClient.categories.queryCategories(options).find();
    console.log('Queried Categories from Wix:', result.items);
    return { items: result.items };
  } catch (error) {
    console.error('Error querying categories from Wix:', error);
    return { items: [] };
  }
}
*/

// --- Wix Pro Gallery API Actions ---

// Server Action to create a new Wix Pro Gallery
export async function createWixProGallery() {
  try {
    console.log("Attempting to create a new Wix Pro Gallery...")
    // Sample gallery data with different item types
    const newGalleryData: proGallery.CreateGalleryOptions = {
      gallery: {
        name: "My API Created Gallery " + new Date().toLocaleString(),
        items: [
          {
            title: "Sample Image Item",
            description: "This is an image added via API.",
            type: "IMAGE",
            image: {
              // IMPORTANT: Images must be uploaded to Wix Media Manager first.
              // Replace with a valid wix:image:// URL from your Wix Media Manager
              imageInfo:
                "wix:image://v1/11062b_1234567890abcdef1234567890abcdef.jpg/my-sample-image.jpg#originWidth=1000&originHeight=750",
            },
          },
          {
            title: "Sample Video Item",
            description: "This is a video added via API.",
            type: "VIDEO",
            video: {
              type: "YOUTUBE", // Or 'WIX_MEDIA'
              // Replace with a valid YouTube URL or wix:video:// URL
              videoInfo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
          },
          {
            title: "Sample Text Item",
            description: "A text item with custom styling.",
            type: "TEXT",
            text: {
              html: '<div style="padding: 20px; background-color: #f0f0f0; text-align: center;"><h2 style="color: #333;">Hello from API!</h2><p style="color: #666;">This text was created programmatically.</p></div>',
              css: {
                backgroundColor: "rgba(240, 240, 240, 0.8)",
              },
            },
          },
        ],
      },
    }
    const newGallery = await wixClient.proGallery.createGallery(newGalleryData)
    console.log("Successfully created gallery:", newGallery)
    return { success: true, message: `Gallery "${newGallery.name}" created with ID: ${newGallery._id}` }
  } catch (error: any) {
    console.error("Error creating gallery:", error)
    return { success: false, message: `Failed to create gallery: ${error.message || "Unknown error"}` }
  }
}

// Server Action to fetch existing Wix Pro Galleries
export async function getWixProGalleries() {
  try {
    console.log("Attempting to fetch Wix Pro Galleries...")
    const { galleries } = await wixClient.proGallery.listGalleries()
    console.log("Successfully fetched galleries:", galleries)
    return { success: true, galleries: galleries, message: "Galleries fetched successfully." }
  } catch (error: any) {
    console.error("Error fetching galleries:", error)
    return { success: false, galleries: [], message: `Failed to fetch galleries: ${error.message || "Unknown error"}` }
  }
}

// Server Action to fetch a single Wix Pro Gallery by ID
export async function getWixProGalleryById(galleryId: string) {
  try {
    console.log(`Attempting to fetch Wix Pro Gallery with ID: ${galleryId}...`)
    const gallery = await wixClient.proGallery.getGallery(galleryId)
    console.log("Successfully fetched gallery details:", gallery)
    return { success: true, gallery: gallery, message: `Gallery "${gallery.name}" fetched successfully.` }
  } catch (error: any) {
    console.error(`Error fetching gallery ${galleryId}:`, error)
    return { success: false, gallery: null, message: `Failed to fetch gallery: ${error.message || "Unknown error"}` }
  }
}

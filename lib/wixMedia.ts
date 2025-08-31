import { media } from "@wix/sdk"

export function getWixImageUrl(wixUrl: string | undefined): string | null {
  if (!wixUrl || !wixUrl.startsWith("wix:image://")) {
    return null
  }
  try {
    const result = media.getImageUrl(wixUrl)
    return result.url
  } catch (error) {
    console.error("Error getting image URL:", error)
    return null
  }
}

export function getWixScaledToFillImageUrl(wixUrl: string | undefined, width: number, height: number): string | null {
  if (!wixUrl || !wixUrl.startsWith("wix:image://")) {
    return null
  }

  try {
    const url = media.getScaledToFillImageUrl(wixUrl, width, height, {
      quality: 85,
      autoEncode: true,
    })
    return url
  } catch (error) {
    console.error("Error getting scaled image URL:", error)
    return getWixImageUrl(wixUrl)
  }
}

export function getWixScaledToFitImageUrl(wixUrl: string | undefined, width: number, height: number): string | null {
  if (!wixUrl || !wixUrl.startsWith("wix:image://")) {
    return null
  }

  try {
    const url = media.getScaledToFitImageUrl(wixUrl, width, height, {
      quality: 90,
      autoEncode: true,
    })
    return url
  } catch (error) {
    console.error("Error getting scaled fit image URL:", error)
    return getWixImageUrl(wixUrl)
  }
}

export function getWixVideoThumbnailUrl(wixUrl: string | undefined): string | null {
  if (!wixUrl || !wixUrl.startsWith("wix:video://")) {
    return null
  }
  try {
    const result = media.getVideoUrl(wixUrl)
    return result.thumbnail // This gives the thumbnail URL
  } catch (error) {
    console.error("Error getting video thumbnail URL:", error)
    return null
  }
}

// Enhanced function to get the best available cover image with detailed logging
export function getBestCoverImage(moment: any): string | null {
  console.log("getBestCoverImage called with:", {
    id: moment._id,
    coverMedia: moment.coverMedia,
    coverPhoto: moment.coverPhoto,
    mediagallery: moment.mediagallery,
    allFields: Object.keys(moment),
  })

  // Try cover media first
  if (moment.coverMedia?.image) {
    console.log("Trying coverMedia.image:", moment.coverMedia.image)
    const coverUrl = getWixScaledToFillImageUrl(moment.coverMedia.image, 2000, 1500)
    if (coverUrl) {
      console.log("Success with coverMedia.image:", coverUrl)
      return coverUrl
    }
  }

  // Try coverPhoto field
  if (moment.coverPhoto) {
    console.log("Trying coverPhoto:", moment.coverPhoto)
    const coverPhotoUrl = getWixScaledToFillImageUrl(moment.coverPhoto, 2000, 1500)
    if (coverPhotoUrl) {
      console.log("Success with coverPhoto:", coverPhotoUrl)
      return coverPhotoUrl
    }
  }

  // Try first image from media gallery
  if (moment.mediagallery && Array.isArray(moment.mediagallery) && moment.mediagallery.length > 0) {
    console.log("Trying mediagallery:", moment.mediagallery)
    const firstImage = moment.mediagallery.find((media: any) => media.src && media.src.startsWith("wix:image://"))
    if (firstImage?.src) {
      console.log("Found first image in gallery:", firstImage.src)
      const galleryUrl = getWixScaledToFillImageUrl(firstImage.src, 2000, 1500)
      if (galleryUrl) {
        console.log("Success with gallery image:", galleryUrl)
        return galleryUrl
      }
    }
  }

  // Try any image field that might exist
  const imageFields = [
    "image",
    "photo",
    "picture",
    "thumbnail",
    "mainImage",
    "featuredImage",
    "coverImage",
    "heroImage",
    "primaryImage",
  ]

  for (const field of imageFields) {
    if (moment[field]) {
      console.log(`Trying field ${field}:`, moment[field])

      // Handle different field structures
      let imageUrl = null
      if (typeof moment[field] === "string" && moment[field].startsWith("wix:image://")) {
        imageUrl = moment[field]
      } else if (moment[field]?.url && moment[field].url.startsWith("wix:image://")) {
        imageUrl = moment[field].url
      } else if (moment[field]?.src && moment[field].src.startsWith("wix:image://")) {
        imageUrl = moment[field].src
      } else if (moment[field]?.imageInfo && moment[field].imageInfo.startsWith("wix:image://")) {
        imageUrl = moment[field].imageInfo
      }

      if (imageUrl) {
        const fieldUrl = getWixScaledToFillImageUrl(imageUrl, 2000, 1500)
        if (fieldUrl) {
          console.log(`Success with ${field}:`, fieldUrl)
          return fieldUrl
        }
      }
    }
  }

  // Try to extract any wix:image:// URLs from the entire object recursively
  const findWixImageInObject = (obj: any, path = "", maxDepth = 3): string | null => {
    if (maxDepth <= 0) return null

    if (typeof obj === "string" && obj.startsWith("wix:image://")) {
      console.log(`Found wix image at ${path}:`, obj)
      return obj
    }

    if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
      for (const [key, value] of Object.entries(obj)) {
        const result = findWixImageInObject(value, `${path}.${key}`, maxDepth - 1)
        if (result) return result
      }
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < Math.min(obj.length, 5); i++) {
        // Limit array search
        const result = findWixImageInObject(obj[i], `${path}[${i}]`, maxDepth - 1)
        if (result) return result
      }
    }

    return null
  }

  const foundImage = findWixImageInObject(moment)
  if (foundImage) {
    console.log("Found image in object:", foundImage)
    const foundUrl = getWixScaledToFillImageUrl(foundImage, 2000, 1500)
    if (foundUrl) {
      console.log("Success with found image:", foundUrl)
      return foundUrl
    }
  }

  console.log("No image found for moment:", moment._id)
  console.log("Available fields:", Object.keys(moment))
  return null
}

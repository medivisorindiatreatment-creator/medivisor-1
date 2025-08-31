/**
 * Converts a Wix imageInfo string into a usable URL for Next.js Image component.
 * It extracts the file ID and constructs an optimized Wix static URL.
 * @param imageInfo The Wix imageInfo string (e.g., "wix:image://v1/...")
 * @param width Desired width for the image (for optimization).
 * @param height Desired height for the image (for optimization).
 * @returns An optimized Wix image URL or a placeholder SVG URL if imageInfo is invalid.
 */
export function getWixImageUrl(imageInfo: string, width = 400, height = 300): string {
  if (!imageInfo) {
    return `/placeholder.svg?width=${width}&height=${height}&query=placeholder image`
  }

  const match = imageInfo.match(/wix:image:\/\/v1\/([^/]+)\/([^#]+)(?:#.*)?/)

  if (match && match[1] && match[2]) {
    const fileId = match[1]
    const fileName = match[2]
    return `https://static.wixstatic.com/media/${fileId}/v1/fill/w_${width},h_${height},al_c,q_80,usm_0.66_1.00_0.01,enc_auto/${fileName}`
  }

  return `/placeholder.svg?width=${width}&height=${height}&query=placeholder image`
}

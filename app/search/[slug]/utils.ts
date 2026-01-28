export const getWixImageUrl = (imageStr: string | null | undefined): string | null => {
  if (!imageStr || typeof imageStr !== "string" || !imageStr.startsWith("wix:image://v1/")) return null
  const parts = imageStr.split("/")
  return parts.length >= 4 ? `https://static.wixstatic.com/media/${parts[3]}` : null
}

export const getImageUrl = (content: any): string | null => {
  if (typeof content === 'string') {
    return getWixImageUrl(content)
  }
  if (!content?.nodes) return null
  const imageNode = content.nodes.find((node: any) => node.type === 'IMAGE')
  return imageNode?.imageData?.image?.src?.id
    ? `https://static.wixstatic.com/media/${imageNode.imageData.image.src.id}`
    : null
}

export const generateSlug = (name: string | undefined): string => {
  if (!name || typeof name !== 'string') {
    return 'unnamed-entity-slug'
  }
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export const getHospitalCity = (hospital: any): string => {
  return hospital.branches?.[0]?.city?.[0]?.name || hospital.branches?.[0]?.city?.[0]?.cityName || ''
}
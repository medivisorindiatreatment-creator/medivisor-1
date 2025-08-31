import Image from "next/image"
import { getWixScaledToFillImageUrl, getYouTubeEmbedUrl } from "@/lib/wixMedia"

interface GalleryMediaItemProps {
  mediaItem: {
    slug: string
    alt?: string
    description?: string
    src?: string
    title?: string
    type?: string // "image", "video"
    settings?: {
      width: number
      height: number
      focalPoint: [number, number]
    }
  }
  width?: number
  height?: number
}

export function GalleryMediaItem({ mediaItem, width = 300, height = 200 }: GalleryMediaItemProps) {
  const isImage = mediaItem.type === "image" || (mediaItem.src && mediaItem.src.startsWith("wix:image://"))
  const isVideo =
    mediaItem.type === "video" ||
    (mediaItem.src && (mediaItem.src.includes("youtube.com") || mediaItem.src.includes("youtu.be")))

  const youtubeEmbedUrl = isVideo ? getYouTubeEmbedUrl(mediaItem.src) : null

  let finalSrc: string | null = null
  if (isImage && mediaItem.src) {
    finalSrc = getWixScaledToFillImageUrl(mediaItem.src, width, height, { quality: 85 })?.url || mediaItem.src
  } else if (mediaItem.src) {
    finalSrc = mediaItem.src // For direct image URLs or other video URLs
  }

  if (youtubeEmbedUrl) {
    return (
      <div className="relative w-full h-full min-h-[150px] rounded-lg overflow-hidden bg-black flex items-center justify-center">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={youtubeEmbedUrl}
          title={mediaItem.title || mediaItem.alt || "Gallery Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )
  } else if (isVideo && finalSrc) {
    return (
      <div className="relative w-full h-full min-h-[150px] rounded-lg overflow-hidden bg-black flex items-center justify-center">
        <video
          src={finalSrc}
          controls
          className="w-full h-full object-contain"
          aria-label={`Play video for ${mediaItem.title || mediaItem.alt || "gallery item"}`}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  } else if (isImage && finalSrc) {
    return (
      <div className="relative w-full h-full min-h-[150px] rounded-lg overflow-hidden">
        <Image
          src={finalSrc || "/placeholder.svg"}
          alt={mediaItem.alt || mediaItem.title || "Gallery Image"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
    )
  } else {
    return (
      <div className="w-full h-full min-h-[150px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm rounded-lg">
        No Media
      </div>
    )
  }
}

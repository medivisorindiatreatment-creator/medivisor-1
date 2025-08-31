"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { wixClient } from "@/lib/wixClient"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowLeft,
  ImageIcon,
  VideoIcon,
  Calendar,
  Hash,
  AlertCircle,
  RefreshCw,
  Play,
  FileText,
  ExternalLink,
  ZoomIn,
} from "lucide-react"
import {
  getWixImageUrl,
  getWixScaledToFillImageUrl,
  getWixScaledToFitImageUrl,
  getWixVideoUrl,
  getYouTubeEmbedUrl,
  getMediaType,
} from "@/lib/wixMedia"

// Updated interfaces to match Wix Pro Gallery API response
interface GalleryItem {
  _id: string
  _createdDate: Date
  _updatedDate: Date
  title?: string
  description?: string
  sortOrder: number
  type: "IMAGE" | "VIDEO" | "TEXT" | "AUDIO" | "DOCUMENT"
  image?: {
    imageInfo: string // wix:image:// format
  }
  video?: {
    type?: "YOUTUBE" | "WIX_MEDIA"
    videoInfo?: string // YouTube URL or wix:video:// format
    duration?: number
  }
  text?: {
    html: string
    css?: any
  }
  link?: {
    text: string
    url: string
  }
}

interface Gallery {
  _id: string
  _createdDate: Date
  name?: string
  sortOrder?: number
  totalItems: number
}

interface GalleryClientProps {
  galleryId: string
}

export function GalleryClient({ galleryId }: GalleryClientProps) {
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGalleryData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching gallery data for ID:", galleryId)

      // Fetch gallery info and items using the proper API methods
      const [galleryResponse, itemsResponse] = await Promise.all([
        wixClient.proGallery.getGallery(galleryId).catch((err) => {
          console.warn("Could not fetch gallery info:", err)
          return null
        }),
        wixClient.proGallery.listGalleryItems(galleryId),
      ])

      console.log("Gallery response:", galleryResponse)
      console.log("Items response:", itemsResponse)

      // Set gallery info or create fallback
      if (galleryResponse) {
        setGallery(galleryResponse)
      } else if (itemsResponse.items && itemsResponse.items.length > 0) {
        // Create fallback gallery info from items
        setGallery({
          _id: galleryId,
          _createdDate: itemsResponse.items[0]._createdDate,
          name: `Gallery ${galleryId.slice(0, 8)}`,
          totalItems: itemsResponse.items.length,
        })
      } else {
        setError("Gallery not found or has no items")
        return
      }

      setGalleryItems(itemsResponse.items || [])
    } catch (err) {
      console.error("Error fetching gallery data:", err)
      setError(err instanceof Error ? err.message : "Failed to load gallery")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (galleryId) {
      fetchGalleryData()
    }
  }, [galleryId])

  if (loading) {
    return <GalleryLoadingSkeleton />
  }

  if (error) {
    return <GalleryError error={error} galleryId={galleryId} onRetry={fetchGalleryData} />
  }

  if (!gallery) {
    return <GalleryNotFound galleryId={galleryId} />
  }

  // Filter items by type
  const imageItems = galleryItems.filter((item) => item.type === "IMAGE")
  const videoItems = galleryItems.filter((item) => item.type === "VIDEO")
  const textItems = galleryItems.filter((item) => item.type === "TEXT")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/galleries">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Galleries
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{gallery.name || "Media Gallery"}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(gallery._createdDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="h-4 w-4" />
                <span>{galleryItems.length} total items</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {imageItems.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                {imageItems.length} Photos
              </Badge>
            )}
            {videoItems.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <VideoIcon className="h-3 w-3" />
                {videoItems.length} Videos
              </Badge>
            )}
            {textItems.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {textItems.length} Text
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {galleryItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <GalleryItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No items in this gallery</h3>
          <p className="text-muted-foreground">This gallery is empty or still being updated.</p>
        </div>
      )}
    </div>
  )
}

// Gallery Item Card Component
function GalleryItemCard({ item }: { item: GalleryItem }) {
  const mediaType = getMediaType(item)

  const renderItemPreview = (isModal = false) => {
    // Handle TEXT items
    if (item.type === "TEXT" && item.text?.html) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center p-4">
          <div
            className="text-white text-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: item.text.html }}
            style={{
              maxWidth: isModal ? "100%" : "280px",
              maxHeight: isModal ? "none" : "280px",
            }}
          />
        </div>
      )
    }

    // Handle VIDEO items
    if (item.type === "VIDEO" && item.video) {
      // Check if it's a YouTube URL
      const youtubeEmbedUrl = getYouTubeEmbedUrl(item.video.videoInfo)

      if (youtubeEmbedUrl) {
        return (
          <div className={isModal ? "aspect-video" : "w-full h-full"}>
            <iframe
              className="w-full h-full"
              src={youtubeEmbedUrl}
              title={item.title || "Video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )
      }

      // Handle Wix video
      if (item.video.videoInfo && item.video.videoInfo.startsWith("wix:video://")) {
        const videoResult = getWixVideoUrl(item.video.videoInfo, "720p")
        if (videoResult) {
          const thumbnailImage = getWixImageUrl(videoResult.thumbnail)
          return (
            <div className="relative">
              <video
                src={videoResult.url}
                poster={thumbnailImage?.url}
                controls={isModal}
                className={isModal ? "w-full h-auto max-h-[80vh]" : "w-full h-full object-cover"}
              >
                Your browser does not support the video tag.
              </video>
              {!isModal && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/20 rounded-full p-3">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          )
        }
      }

      // Fallback for video items
      return (
        <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-white">
          <VideoIcon className="h-12 w-12 mb-2" />
          <span className="text-sm">Video Content</span>
          {item.title && <span className="text-xs mt-1 text-center px-2">{item.title}</span>}
        </div>
      )
    }

    // Handle IMAGE items
    if (item.type === "IMAGE" && item.image?.imageInfo) {
      const imageIdentifier = item.image.imageInfo

      // Get optimized URLs based on context
      const imageUrl = isModal
        ? getWixScaledToFitImageUrl(imageIdentifier, 1200, 800, {
            quality: 95,
            shouldLoadHQImage: true,
          })
        : getWixScaledToFillImageUrl(imageIdentifier, 300, 300, {
            quality: 80,
            filters: { contrast: 1.05 },
          })

      // Fallback to original image if optimization fails
      const fallbackImage = getWixImageUrl(imageIdentifier)

      return (
        <div className="relative">
          <Image
            src={imageUrl || fallbackImage?.url || "/placeholder.svg"}
            alt={fallbackImage?.altText || item.title || "Gallery item"}
            width={isModal ? 1200 : 300}
            height={isModal ? 800 : 300}
            className={
              isModal
                ? "w-full h-auto max-h-[80vh] object-contain"
                : "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            }
          />
          {!isModal && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
      )
    }

    // Fallback for unknown media types
    const getMediaIcon = () => {
      switch (mediaType) {
        case "text":
          return <FileText className="h-12 w-12 text-gray-400" />
        case "video":
          return <VideoIcon className="h-12 w-12 text-gray-400" />
        default:
          return <ImageIcon className="h-12 w-12 text-gray-400" />
      }
    }

    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center">
        {getMediaIcon()}
        <span className="mt-2 text-sm text-gray-500 capitalize">
          {mediaType === "unknown" ? "No Media" : mediaType}
        </span>
        {item.title && <span className="text-xs mt-1 text-center px-2">{item.title}</span>}
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="aspect-square relative overflow-hidden">
            {renderItemPreview(false)}

            {/* Media type badge */}
            {mediaType !== "image" && (
              <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                {mediaType === "video" && <VideoIcon className="h-3 w-3 mr-1" />}
                {mediaType === "text" && <FileText className="h-3 w-3 mr-1" />}
                {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
              </Badge>
            )}

            {/* External link indicator */}
            {item.link && (
              <Badge className="absolute top-2 left-2 bg-blue-600/70 text-white">
                <ExternalLink className="h-3 w-3 mr-1" />
                Link
              </Badge>
            )}
          </div>

          {item.title && (
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              )}
            </CardContent>
          )}
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative">
          {renderItemPreview(true)}

          <div className="p-6">
            {item.title && <h3 className="text-xl font-semibold mb-2">{item.title}</h3>}
            {item.description && <p className="text-muted-foreground mb-4">{item.description}</p>}

            {/* External link */}
            {item.link && (
              <Button asChild variant="outline" size="sm" className="mb-4 bg-transparent">
                <a href={item.link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {item.link.text || "View Link"}
                </a>
              </Button>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Created: {new Date(item._createdDate).toLocaleDateString()}</span>
              <span className="capitalize">{item.type.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function GalleryLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-32 mb-4" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-3">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function GalleryError({
  error,
  galleryId,
  onRetry,
}: {
  error: string
  galleryId: string
  onRetry: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/galleries">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Galleries
        </Button>
      </Link>

      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="space-y-4">
          <div>
            <div className="font-semibold">Failed to load gallery</div>
            <div className="text-sm mt-1">
              <strong>Gallery ID:</strong> {galleryId}
            </div>
            <div className="text-sm">
              <strong>Error:</strong> {error}
            </div>
          </div>

          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <div className="text-sm text-muted-foreground">
            This could be due to:
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Gallery doesn't exist or has been deleted</li>
              <li>Authentication issues with Wix client</li>
              <li>Network connectivity problems</li>
              <li>Insufficient permissions to access this gallery</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}

function GalleryNotFound({ galleryId }: { galleryId: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/galleries">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Galleries
        </Button>
      </Link>

      <div className="text-center py-12 max-w-2xl mx-auto">
        <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Gallery Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The gallery with ID <code className="bg-muted px-2 py-1 rounded text-sm">{galleryId}</code> could not be
          found.
        </p>
        <Link href="/galleries">
          <Button>Browse All Galleries</Button>
        </Link>
      </div>
    </div>
  )
}
